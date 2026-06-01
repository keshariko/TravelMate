import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Automatically download required NLTK resources
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt", quiet=True)

try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    nltk.download("stopwords", quiet=True)

# Initialize stemmer and stop words
stemmer = PorterStemmer()
stop_words_set = set(stopwords.words("english"))

def clean_text(text: str) -> str:
    """
    Lowercase text, remove special characters, punctuation, and extra whitespaces.
    """
    if not text:
        return ""
    text = text.lower()
    # Remove punctuation/special characters but keep alphanumeric and spaces
    text = re.sub(r"[^\w\s]", " ", text)
    # Remove multiple whitespaces
    text = re.sub(r"\s+", " ", text).strip()
    return text

def tokenize(text: str) -> list[str]:
    """
    Split clean text into words.
    """
    cleaned = clean_text(text)
    return cleaned.split()

def remove_stopwords(tokens: list[str]) -> list[str]:
    """
    Filter out common English stop words.
    """
    return [token for token in tokens if token not in stop_words_set]

def stem_tokens(tokens: list[str]) -> list[str]:
    """
    Apply Porter Stemmer to each token.
    """
    return [stemmer.stem(token) for token in tokens]

def preprocess_text(text: str) -> str:
    """
    Full text preprocessing pipeline for intent classification:
    Clean -> Tokenize -> Stopwords Removal -> Stemming -> Rejoined String.
    """
    tokens = tokenize(text)
    filtered = remove_stopwords(tokens)
    stemmed = stem_tokens(filtered)
    return " ".join(stemmed)

# Reusable tokenizer for TfidfVectorizer (keeps structural grammatical tokens for short queries)
def custom_vectorizer_tokenizer(text: str) -> list[str]:
    tokens = tokenize(text)
    return stem_tokens(tokens)
