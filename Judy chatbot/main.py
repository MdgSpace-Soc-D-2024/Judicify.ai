import os
import argparse
import numpy as np
from sentence_transformers import SentenceTransformer
from src.data.loader import load_book
from src.data.splitter import split_text
from src.services.chroma_services import save_to_chroma, load_chroma
from src.models.generator import generate_result
from src.services.chroma_services import SentenceTransformerEmbeddings

BOOK_PATH = "C:/Users/devan/College/SoC/Judy chatbot/Data/Indian_Constitution.txt"
CHROMA_PATH = "chroma"
model_name = "mistralai/Mistral-7B-Instruct-v0.3"
sentense_transformer_model = SentenceTransformer("all-MiniLM-L6-v2")

def main(query_text):
    
    print("Recieved your prompt ! Loading the db and finding matching results....")
    if not os.path.exists(CHROMA_PATH):
        os.makedirs(CHROMA_PATH)
        documents = load_book("src/data/constitution_1.txt")
        chunks = split_text(documents)
        save_to_chroma(chunks)
        documents = load_book("src/data/constitution_2.txt")
        chunks = split_text(documents)
        save_to_chroma(chunks)        
        documents = load_book("src/data/constitution_3.txt")
        chunks = split_text(documents)
        save_to_chroma(chunks)
    embedding_function = SentenceTransformerEmbeddings(sentense_transformer_model)
    db = load_chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    results = db.similarity_search_with_relevance_scores(query_text, k=3)
    if len(results) == 0 :
        print(f"\nUnable to find matching results for '{query_text}'")
        hi = "Unable to find matching results for the query asked"
        return hi
    
    first_score = results[0][1]
    if isinstance(first_score, (list, np.ndarray)):
        first_score = first_score.item()

    if first_score < 0.001:
        print(f"\nUnable to find matching results for '{query_text}'")
        hi = "Unable to find matching results for the query asked"
        return hi

    print("Fetched results ! Framing the answer....\n")
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt = f"Given below are 2 sides of a case. Analyise both the cases. \n\n {query_text} \n\n Now on the basis of the following context: {context_text} \n\n give advise on what judge should do."
    reply = generate_result(prompt)
    # print(reply)
    return reply

if __name__ == "__main__":
    main()
