
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # prompt= 'hello'

def generate_result(prompt):
    API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
    HEADERS = {"Authorization": os.getenv('HUGGINGFACE_API_KEY') }    
    data = {"inputs": prompt}
    response = requests.post(API_URL, headers=HEADERS, json=data)
    
    if response.status_code == 200:
        result = response.json()
        generated_text = result[0]["generated_text"].replace("  ", "")
        if generated_text.startswith(prompt):
            generated_text = generated_text[len(prompt):].strip() #ye cheez figure out kari
        print(generated_text)
        return generated_text
    else:
        return f"Error: {response.status_code}, {response.text}"

# prompt = "How are you feeling"
# summary = generate_result(prompt)
# print(summary)
