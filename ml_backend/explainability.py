import shap
import numpy as np
import torch
import torch.nn.functional as F

# META CLASSIFIER EXPLANATION (SHAP)

def explain_meta(meta_explainer, meta_clf, meta_input, class_index):

    meta_input_dense = np.array(meta_input, dtype=np.float64)

    shap_values = meta_explainer.shap_values(meta_input_dense, check_additivity=False)

    feature_names = [
        "rf_prob_fake",
        "rf_prob_real",
        "bert_prob_fake",
        "bert_prob_real"
    ]

    if isinstance(shap_values, list):
        shap_array = shap_values[class_index][0]
    else:
        shap_array = shap_values[0]

    shap_dict = {
        feature: float(value)
        for feature, value in zip(feature_names, shap_array)
    }

    return shap_dict

# RANDOM FOREST EXPLANATION (SHAP)

def explain_random_forest(rf_explainer, rf_model, vectorizer, clean_text):

    X_vec = vectorizer.transform([clean_text])

    X_dense = X_vec.toarray().astype(np.float64)

    shap_values = rf_explainer.shap_values(X_dense, check_additivity=False)

    feature_names = vectorizer.get_feature_names_out()

    if isinstance(shap_values, list):
        shap_array = shap_values[1][0]
    else:
        shap_array = shap_values[0, :, 1]

    word_importance = list(zip(feature_names, shap_array))
    word_importance = sorted(
        word_importance,
        key=lambda x: abs(x[1]),
        reverse=True
    )
    top_words = word_importance[:5]

    total = sum(abs(v) for _, v in top_words) or 1.0

    user_output = []
    for word, value in top_words:
        contribution_percent = (abs(float(value)) / total) * 100

        if contribution_percent >= 30:
            level = "Very High"
        elif contribution_percent >= 20:
            level = "High"
        elif contribution_percent >= 10:
            level = "Medium"
        else:
            level = "Low"

        user_output.append({
            "word": word,
            "influence_percentage": round(contribution_percent, 2),
            "influence_level": level
        })

    return user_output


# TRANSFORMER EXPLANATION (Attention)

def explain_transformer(bert_model, tokenizer, clean_text, max_len):

    inputs = tokenizer(
        clean_text,
        return_tensors="pt",
        truncation=True,
        padding="max_length",
        max_length=max_len
    )

    with torch.no_grad():
        outputs = bert_model(
            **inputs,
            output_attentions=True
        )

    if outputs.attentions is None:
        return []

    attentions = outputs.attentions[-1]
    token_importance = attentions.mean(dim=1).mean(dim=1).squeeze()
    token_importance = token_importance / token_importance.sum()

    tokens = tokenizer.convert_ids_to_tokens(
        inputs["input_ids"][0]
    )

    merged_words = []
    merged_scores = []

    current_word = ""
    current_score = 0.0

    for token, score in zip(tokens, token_importance.tolist()):

        if token in ["[CLS]", "[SEP]", "[PAD]"]:
            continue

        if token.startswith("##"):
            current_word += token[2:]
            current_score += score
        else:
            if current_word != "":
                merged_words.append(current_word)
                merged_scores.append(current_score)

            current_word = token
            current_score = score

    if current_word != "":
        merged_words.append(current_word)
        merged_scores.append(current_score)

    word_importance = list(zip(merged_words, merged_scores))
    word_importance = sorted(
        word_importance,
        key=lambda x: x[1],
        reverse=True
    )

    total_score = sum(score for _, score in word_importance)

    user_output = []

    for word, score in word_importance[:5]:

        contribution_percent = (score / total_score) * 100 if total_score != 0 else 0

        if contribution_percent >= 30:
            level = "Very High"
        elif contribution_percent >= 20:
            level = "High"
        elif contribution_percent >= 10:
            level = "Medium"
        else:
            level = "Low"

        user_output.append({
            "word": word,
            "influence_percentage": round(contribution_percent, 2),
            "influence_level": level
        })

    return user_output