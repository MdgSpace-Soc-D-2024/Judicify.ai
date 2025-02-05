# Judicify.AI - AI-Powered Judicial Assistance Platform
## MDG Season of Code 2024

An AI-powered RAG-implimented platform accelerating judicial processes through automated case analysis and citizen legal assistance.

## 🚀 Features

### For Judiciary
- **Secure Case Rooms** with real-time chat and document sharing
- **AI-Powered Case Analysis** using RAG architecture
- **Historical Verdict Recommendations** (MistralAi integration)
- **PDF Document Analysis** for evidence evaluation

### For Citizens
- **Legal Query Portal** with natural language processing
- **IPC/MVA Section Explanations**

## 🛠 Tech Stack

| Component       | Technologies Used                              |
|-----------------|-----------------------------------------------|
| Frontend        | React, Socket.io Client        |
| Backend         | Node.js, Express, MongoDB, Socket.io         |
| AI Core         | Python, HuggingFace Transformers, PyMuPDF     |
| Authentication  | JWT, Bcrypt                                   |
| Deployment      | Local Development Setup                       |

## ⚙️ Installation

Clone repository
git clone https://github.com/MdgSpace-Soc-D-2024/Judicify.ai.git
cd Judicify.AI

### Frontend Setup
cd frontend
npm install

### Backend Setup
cd ../backend
npm install

### JudyBot Setup (AI Module)
cd ../JudyBot
python -m venv venv
Windows: venv\Scripts\activate
source venv/bin/activate
pip install -r requirements.txt

## 🔧 Configuration

Create `.env` files with these variables:

**backend/.env**
PORT=1818
MONGO_CONN=your_mongoDB_URI_or_connection_string
JWT_SECRET=your_jwt_secret_key
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_specific_password
CLIENT_URL=http://localhost:3000
text

**JudyBot/.env**
HUGGINGFACE_API_KEY=your_huggingface_api_key
text

## 🖥 Running the Application

1. **Start Backend**
cd backend
npm start
text

2. **Start Frontend**
cd frontend
npm start
text

3. **Start JudyBot (AI Service)**
cd JudyBot
source venv/bin/activate # Windows: venv\Scripts\activate
python server.py
text

Access the platform at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:1818`
- AI Service: `http://localhost:5000`

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact
**Devansh Chouksey**  
[devanshchouksey01@gmail.com](mailto:devanshchouksey01@gmail.com)
