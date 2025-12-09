# 🧪 MedToXAi Platform

> **AI-powered molecular toxicity prediction system with OCR image analysis and intelligent chemical safety assessment**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3+-000000.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Features

- **🔬 Image Analysis**: Upload medicine labels, perform OCR, extract ingredients
- **🧬 Toxicity Prediction**: Predict toxicity across 12 biological endpoints
- **🤖 AI Integration**: Groq LLaMA 3.3 for intelligent chemical analysis
- **📊 Advanced Analytics**: Real-time visualization with charts
- **⚡ High Performance**: Prediction caching, rate limiting, optimized models

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API Key
- Supabase Account (optional)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/medtox-scan-ai.git
cd medtox-scan-ai

# 2. Setup backend
cd backend
cp .env.example .env
# Edit .env with your API keys
pip install -r requirements.txt

# 3. Setup frontend
cd ../frontend
npm install

# 4. Start platform
# Backend: python app.py (port 5000)
# Frontend: npm start (port 3000)
```

## 📁 Project Structure

```
medtox-scan-ai/
├── backend/           # Flask API server
├── frontend/          # React application
├── model-training/    # ML model training pipeline
├── docs/             # Documentation
└── tests/            # Test suites
```

## 📚 Documentation

- **[Quick Start Guide](docs/guides/QUICK_START.md)** - Get started in 5 minutes
- **[Deployment Guide](docs/guides/DEPLOYMENT_GUIDE.md)** - Deploy to production
- **[Model Training Guide](docs/training/MODEL_TRAINING_GUIDE.md)** - Train new models
- **[API Documentation](docs/guides/API_DOCUMENTATION.md)** - API reference
- **[Full Documentation](docs/README.md)** - Complete documentation index

## 🧠 Model Training

Train high-accuracy toxicity prediction models:

```bash
cd model-training
python scripts/train_models.py --data data/tox21_data.csv
```

See [Model Training Guide](docs/training/MODEL_TRAINING_GUIDE.md) for details.

## 🎯 Key Technologies

### Backend
- **Flask** - Web framework
- **XGBoost** - Machine learning models
- **RDKit** - Molecular descriptors
- **Groq AI** - LLaMA 3.3 integration
- **Supabase** - PostgreSQL database

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Tesseract.js** - OCR engine
- **React Hot Toast** - Notifications

## 📊 Performance

- **Prediction Speed**: ~200ms/molecule
- **Batch Processing**: ~50 molecules/minute
- **Model Accuracy**: 84%+ ROC-AUC average
- **API Response Time**: 500-800ms
- **Cache Hit Rate**: 60-70%

## 🔒 Security

- ✅ Input validation and sanitization
- ✅ API rate limiting (60 req/min default)
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Secure database connections

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

- **Tox21 Challenge** - Training data
- **RDKit** - Molecular descriptors
- **Groq** - AI inference
- **Supabase** - Database hosting

## 📞 Support

- **Documentation**: [docs/README.md](docs/README.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/medtox-scan-ai/issues)
- **Email**: support@medtoxai.com

---

**Built with ❤️ for safer drug development**
