from langchain.text_splitter import RecursiveCharacterTextSplitter

def split_text(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=55,
        separators=["\n\n","\n"," ",""]
    )
    text_chunks = text_splitter.split_documents(documents)
    print(f'split the book into {len(text_chunks)} chunks')
    return text_chunks