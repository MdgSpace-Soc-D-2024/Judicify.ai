import os
from flask import Flask, request, jsonify
from src.models.pdfToTxt import pdf_to_text
from flask_cors import CORS  
from main import main

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/response', methods=['POST'])
def upload_pdfs():
    if 'pdf1' not in request.files or 'pdf2' not in request.files:
        return jsonify({"error": "Both PDF files are required"}), 400

    pdf1 = request.files['pdf1']
    pdf2 = request.files['pdf2']

    pdf1_path = os.path.join(UPLOAD_FOLDER, pdf1.filename)
    pdf2_path = os.path.join(UPLOAD_FOLDER, pdf2.filename)

    pdf1.save(pdf1_path)
    pdf2.save(pdf2_path)

    case_data = pdf_to_text(pdf1_path, pdf2_path)
    final_generation = main(case_data)

    # print(final_generation)
    response_data = {
        "message": final_generation
    }

    return jsonify(response_data), 200
if __name__ == '__main__':
    app.run(debug=True)
