from langchain_community.document_loaders import TextLoader
import os

def load_book(BOOK_PATH):
    
        try:      
            loader = TextLoader(BOOK_PATH)
            documents = loader.load()
            # print(documents)
            return documents
        except Exception as e:
            print(f'Error in loading book: {e}')
            return Exception
# load_book()