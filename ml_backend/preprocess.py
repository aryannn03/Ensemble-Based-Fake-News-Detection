import re
import html
import unicodedata

import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

try:
    _ = stopwords.words("english")
except LookupError:
    nltk.download("stopwords")

EN_STOPWORDS = set(stopwords.words("english"))
PORTER = PorterStemmer()

def _normalize_unicode(text: str) -> str:
   
    return unicodedata.normalize("NFKC", text)


def clean_text(text: str) -> str:
   
    if text is None:
        return ""

    # Coerce to string
    text = str(text)

    # Unescape HTML entities
    text = html.unescape(text)

    # Normalize unicode
    text = _normalize_unicode(text)

    # Lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\.\S+", " ", text)

    # Remove @mentions and #hashtags
    text = re.sub(r"@\w+", " ", text)
    text = re.sub(r"#\w+", " ", text)

    # Remove HTML tags
    text = re.sub(r"<.*?>", " ", text)

    # Keep only letters, digits and spaces
    text = re.sub(r"[^a-z0-9\s]", " ", text)

    # Optional: remove isolated numeric tokens (uncomment if desired)
    # text = re.sub(r"\b\d+\b", " ", text)

    # Collapse multiple spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text


def preprocess_corpus(texts):
   
    return [clean_text(t) for t in texts]


def tokenize_simple(text: str):
   
    if text is None:
        return []
    return str(text).split()


def tokenize_porter(text: str):
    
    tokens = tokenize_simple(text)
    return [PORTER.stem(tok) for tok in tokens]


def preprocess_for_classical(
    text: str,
    apply_stemming: bool = True,
    remove_stopwords: bool = True,
) -> str:
    base = clean_text(text)

    # Tokenize
    tokens = tokenize_simple(base)

    # Stopword removal
    if remove_stopwords:
        tokens = [t for t in tokens if t not in EN_STOPWORDS]

    # Stemming
    if apply_stemming:
        tokens = [PORTER.stem(t) for t in tokens]

    # Join back into string for TF-IDF
    return " ".join(tokens)


def preprocess_corpus_for_classical(texts, apply_stemming: bool = True, remove_stopwords: bool = True):
    return [
        preprocess_for_classical(t, apply_stemming=apply_stemming, remove_stopwords=remove_stopwords)
        for t in texts
    ]
