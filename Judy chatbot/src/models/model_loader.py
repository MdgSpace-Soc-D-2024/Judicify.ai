from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM

def load_generator(model_name):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)
    return model, tokenizer


