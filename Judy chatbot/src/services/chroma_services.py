import os
import shutil
from sentence_transformers import SentenceTransformer
from langchain_chroma import Chroma

CHROMA_PATH = "chroma"
class SentenceTransformerEmbeddings:
    def __init__(self, model):
        self.model = model

    def embed_documents(self, texts):
        return self.model.encode(texts, show_progress_bar=True)

    def embed_query(self, text):
        return self.model.encode(text, show_progress_bar=False)

def save_to_chroma(chunks):
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    sentense_transformer_model = SentenceTransformer("all-MiniLM-L6-v2")
    embedding_function = SentenceTransformerEmbeddings(sentense_transformer_model)
    db = Chroma.from_documents(
        documents=chunks, embedding=embedding_function, persist_directory=CHROMA_PATH
    )
    
def load_chroma(persist_directory, embedding_function):
    return Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)