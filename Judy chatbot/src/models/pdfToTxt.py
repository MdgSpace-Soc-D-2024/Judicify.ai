import os
import fitz 

def pdf_to_text(pdf_path1, pdf_path2):
 pdf_document1 = fitz.open(pdf_path1)
 pdf_document2 = fitz.open(pdf_path2)
 text_content = ""  
 

 for page_number in range(len(pdf_document1)):
        page = pdf_document1.load_page(page_number)
        text_content += "This is one side of the case \n\n"  + page.get_text() + "\n\n"

 for page_number in range(len(pdf_document2)):
        page = pdf_document2.load_page(page_number)
        text_content += "This is other side of the case \n\n" + page.get_text() + "\n\n"

 pdf_document1.close()
 pdf_document2.close()
 return text_content

# extracted_text = pdf_to_text(pdf_path1, pdf_path2)
# print(extracted_text)