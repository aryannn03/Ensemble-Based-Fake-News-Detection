import os
import sys
import numpy as np
import torch
import torch.nn.functional as F
from joblib import load
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

BASE_DIR = os.path.dirname(os.path.abspath(__file__))   
PROJECT_ROOT = os.path.dirname(BASE_DIR)               
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

sys.path.append(BASE_DIR)
sys.path.append(PROJECT_ROOT)

from preprocess import clean_text, preprocess_corpus_for_classical

label_encoder = load(os.path.join(MODELS_DIR, "label_encoder.pkl"))
LABEL_CLASSES = list(label_encoder.classes_)  # ['fake', 'real']

vectorizer = load(os.path.join(MODELS_DIR, "vectorizer.pkl"))
rf_model = load(os.path.join(MODELS_DIR, "classical_model.pkl"))

saved = torch.load(
    os.path.join(MODELS_DIR, "transformer_model.pt"),
    map_location=torch.device("cpu")
)

MODEL_NAME = saved["model_name"]
NUM_LABELS = saved["num_labels"]
MAX_LEN = saved["max_len"]
STATE_DICT = saved["model_state_dict"]

tokenizer = DistilBertTokenizerFast.from_pretrained(MODEL_NAME)
bert_model = DistilBertForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=NUM_LABELS
)
bert_model.load_state_dict(STATE_DICT)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
bert_model.to(device)
bert_model.eval()

meta_clf = load(os.path.join(MODELS_DIR, "meta_classifier.pkl"))

def get_rf_probabilities(clean_texts):

    processed = preprocess_corpus_for_classical(clean_texts)
    X_vec = vectorizer.transform(processed)
    proba = rf_model.predict_proba(X_vec)
    rf_classes = list(rf_model.classes_)

    if isinstance(rf_classes[0], (int, np.integer)):
        rf_labels = label_encoder.inverse_transform(rf_classes)
    else:
        rf_labels = rf_classes

    reordered = np.zeros((len(clean_texts), len(LABEL_CLASSES)))
    for i, lab in enumerate(LABEL_CLASSES):
        reordered[:, i] = proba[:, rf_labels.tolist().index(lab)]

    return reordered

def get_bert_probabilities(clean_texts):

    enc = tokenizer(
        clean_texts,
        truncation=True,
        max_length=MAX_LEN,
        padding="max_length",
        return_tensors="pt"
    )

    enc = {k: v.to(device) for k, v in enc.items()}

    with torch.no_grad():
        outputs = bert_model(**enc)
        probs = F.softmax(outputs.logits, dim=1).cpu().numpy()

    return probs

def predict_news(text: str):

    cleaned_text = clean_text(text)

    rf_probs = get_rf_probabilities([cleaned_text])[0]
    rf_pred_idx = np.argmax(rf_probs)
    rf_pred_label = LABEL_CLASSES[rf_pred_idx]

    bert_probs = get_bert_probabilities([cleaned_text])[0]
    bert_pred_idx = np.argmax(bert_probs)
    bert_pred_label = LABEL_CLASSES[bert_pred_idx]

    meta_input = np.array([
        rf_probs[0], rf_probs[1],
        bert_probs[0], bert_probs[1]
    ]).reshape(1, -1)

    meta_pred_idx = meta_clf.predict(meta_input)[0]
    meta_pred_label = LABEL_CLASSES[meta_pred_idx]
    meta_confidence = float(
        meta_clf.predict_proba(meta_input)[0][meta_pred_idx]
    )

    CONF_THRESHOLD = 0.6
    if meta_confidence >= CONF_THRESHOLD:
        reliability_note = "High confidence prediction"
    else:
        reliability_note = (
            "Low confidence prediction. "
            "Input may belong to a different domain or be ambiguous."
        )

    return {
        "final_prediction": meta_pred_label,
        "confidence": round(meta_confidence, 4),
        "confidence_note": reliability_note,
    }
