# 🧪 MedToXAi Platform

> **AI-powered molecular toxicity prediction system with OCR image analysis and intelligent chemical safety assessment**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-61dafb.svg)
![AI](https://img.shields.io/badge/AI-Groq%20LLaMA3-purple.svg)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Groq API Key
- Supabase Account (optional but recommended)

### 🔒 Security Setup

⚠️ **Important**: Never commit API keys or sensitive credentials to version control!

1. **Configure Environment Variables**
```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with your actual API keys and credentials

# Validate configuration
python validate_env.py
```

### 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/GauravPatil2515/medtoxai.git
cd medtoxai
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

### � Core Capabilities
- **Image Analysis**: Upload medicine images → OCR text extraction → AI ingredient analysis
- **5 Toxicity Endpoints**: NR-AR, NR-AR-LBD, NR-AhR, NR-ER-LBD, SR-MMP
- **SMILES Input**: Direct molecular structure input for toxicity prediction
- **AI Integration**: Groq LLaMA3 for intelligent analysis and explanations
- **Real-time Predictions**: Instant results with confidence scoring

### 🤖 Advanced Features
- **OCR Technology**: Tesseract.js for medicine label text extraction
- **Machine Learning**: Random Forest models (79.3% average accuracy)
- **Database Integration**: Supabase for prediction history
- **Responsive UI**: Modern React interface with Tailwind CSS
- **Export Options**: JSON/CSV data export capabilities

## 📁 Project Structure

```
medtoxai/
├── backend/                    # Flask API server
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── models/
│   │   ├── simple_predictor.py        # ML prediction engine
│   │   ├── best_optimized_models.pkl  # Trained ML models
│   │   └── database.py                # Database models
│   └── config/
│       ├── groq.py            # Groq AI configuration
│       └── supabase.py        # Database configuration
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ImageAnalysis.jsx      # Main OCR + AI feature
│   │   │   ├── AIChat.jsx             # AI chatbot
│   │   │   └── Layout/                # Layout components
│   │   └── pages/             # Application pages
│   │       ├── Predictions.jsx        # SMILES prediction
│   │       ├── Dashboard.jsx          # Analytics dashboard
│   │       └── Home.jsx               # Landing page
│   └── public/                # Static assets
├── database/
│   └── schema.sql             # Database schema
├── docs/                      # Documentation
│   ├── COMPLETE_PROJECT_REPORT.md     # Technical documentation
│   └── ROADMAP.md                     # Development roadmap
├── START_PLATFORM.bat         # Windows startup script
└── README.md
```

## 🔬 API Endpoints
- `GET /api/health` - Health check and status
- `POST /api/predict` - Single molecule toxicity prediction
- `POST /api/analyze-image-text` - OCR text analysis
- `POST /api/analyze-image-vision` - AI vision analysis
- `POST /api/predict/batch` - Batch prediction
- `GET /api/endpoints` - Available toxicity endpoints

## 💡 Usage

### Image Analysis (Primary Feature)
1. Navigate to "Image Analysis" page
2. Upload medicine label image
3. View OCR text extraction
4. Get AI ingredient analysis
5. Predict toxicity for extracted compounds

### Direct SMILES Prediction
1. Go to "Predictions" page
2. Enter SMILES string (e.g., `CCO` for ethanol)
3. Click "Predict Toxicity"
4. View results across 5 endpoints

## 📊 Model Performance
- **Average ROC-AUC**: 0.793 across all endpoints
- **Best Endpoint**: NR-AR-LBD (0.839 ROC-AUC)
- **Models**: Random Forest classifiers
- **Features**: 50 molecular descriptors per compound

## 📚 Documentation
- Complete technical documentation: [`docs/COMPLETE_PROJECT_REPORT.md`](docs/COMPLETE_PROJECT_REPORT.md)
- Development roadmap: [`docs/ROADMAP.md`](docs/ROADMAP.md)