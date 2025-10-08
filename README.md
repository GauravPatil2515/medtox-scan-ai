# 🧪 MedTox-Scan-AI Platform

> **Advanced AI-powered drug toxicity prediction platform with molecular visualization and intelligent ChemBio assistant**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-61dafb.svg)
![AI](https://img.shields.io/badge/AI-Groq%20LLaMA3-purple.svg)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/GauravPatil2515/medtox-scan-ai.git
cd medtox-scan-ai
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### 🏃‍♂️ Running the Platform

**Option 1: Use the startup script (Windows)**
```bash
START_PLATFORM.bat
```

**Option 2: Manual startup**

Backend (Terminal 1):
```bash
cd backend
python app.py
```

Frontend (Terminal 2):
```bash
cd frontend
npm start
```

**Access the platform:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🌟 Features

### 💊 Toxicity Prediction
- **5 Toxicity Endpoints**: NR-AR-LBD, NR-AhR, SR-MMP, NR-ER-LBD, NR-AR
- **SMILES-based Input**: Enter molecular structures as SMILES strings
- **Real-time Analysis**: Instant predictions with confidence scores
- **ML Models**: Optimized Random Forest and Gradient Boosting ensembles

### 🤖 AI-Powered ChemBio Assistant
- **Groq LLaMA3 Integration**: Advanced AI responses
- **Comprehensive Knowledge Base**: 30+ chemistry and biology topics
- **Fallback System**: Reliable responses even when AI service is unavailable
- **Scientific Accuracy**: Detailed explanations of drug mechanisms and toxicity

### 🔬 Advanced Features
- **Molecular Visualization**: Canvas-based 2D structure rendering
- **Prediction History**: Local storage with export capabilities
- **Analytics Dashboard**: Usage statistics and trends
- **Export Functionality**: CSV/JSON data export
- **Progressive Web App**: Installable on any device

## 📁 Project Structure

```
MedTox-Scan-AI/
├── backend/                    # Flask API server
│   ├── app.py                 # Main application
│   ├── requirements.txt       # Python dependencies
│   ├── models/
│   │   ├── simple_predictor.py    # ML predictor
│   │   ├── database.py            # Database models
│   │   └── best_optimized_models.pkl  # Trained models
│   └── config/
│       ├── groq.py            # AI client configuration
│       └── supabase.py        # Database configuration
├── frontend/                  # React application
│   ├── package.json          # Node dependencies
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ChemBioBot.jsx    # AI assistant
│   │   │   ├── MolecularVisualization.jsx
│   │   │   └── ...
│   │   └── pages/           # Application pages
│   └── public/              # Static assets
├── database/
│   └── schema.sql           # Database schema
├── START_PLATFORM.bat       # Windows startup script
└── README.md
```

## 🧪 Features
- **5 Toxicity Endpoints**: NR-AR-LBD, NR-AhR, SR-MMP, NR-ER-LBD, NR-AR
- **Real-time Predictions**: Instant SMILES-based toxicity analysis
- **Clean Architecture**: Separated frontend and backend
- **Responsive UI**: Modern React interface with Tailwind CSS
- **Production Ready**: Optimized models and error handling

## 🔬 API Endpoints
- `GET /`: Health check
- `POST /predict`: Single compound prediction
- `GET /health`: System status

## 💡 Usage
1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Enter SMILES strings for toxicity prediction
4. View results across 5 toxicity endpoints

## 📊 Model Performance
The platform uses optimized Random Forest models trained on comprehensive toxicity datasets with high accuracy across all endpoints.