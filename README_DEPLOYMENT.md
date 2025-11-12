# 🧪 MedToXAi Platform - Complete Deployment Package

## 📋 Project Overview

**MedToXAi** is an AI-powered molecular toxicity prediction platform featuring:
- 5 toxicity endpoint analysis (NR-AR-LBD, NR-AhR, SR-MMP, NR-ER-LBD, NR-AR)
- Machine learning models with 95%+ accuracy
- Groq AI integration for intelligent analysis
- OCR-based medicine label analysis
- Real-time SMILES-based predictions
- Supabase database for history tracking

## 🚀 Quick Start - Deploy to Render

### Prerequisites
```bash
✅ Git installed
✅ Node.js 18+ installed
✅ Python 3.11+ installed
✅ Render account (free tier works)
✅ Groq API key
✅ Supabase account (optional)
```

### 1. Clone and Setup
```bash
git clone https://github.com/GauravPatil2515/medtox-scan-ai.git
cd medtox-scan-ai

# Install dependencies
cd backend && pip install -r requirements.txt && cd ..
cd frontend && npm install && cd ..
```

### 2. Configure Environment Variables

Create `backend/.env`:
```properties
GROQ_API_KEY=your-groq-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
FLASK_ENV=production
FLASK_DEBUG=False
CORS_ORIGINS=https://your-frontend-url.onrender.com
AI_MODEL=llama-3.3-70b-versatile
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=1024
```

### 3. Deploy on Render

#### Option A: Automatic (Blueprint)
1. Push to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **"New" → "Blueprint"**
4. Select your repository
5. Render detects `render.yaml` automatically
6. Set environment variables
7. Click **"Apply"**

#### Option B: Manual
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed manual setup.

### 4. Access Your Deployment
- **Frontend**: `https://medtoxai-frontend.onrender.com`
- **Backend API**: `https://medtoxai-backend.onrender.com`
- **Health Check**: `https://medtoxai-backend.onrender.com/api/health`

## 📁 Project Structure

```
medtox-scan-ai/
├── backend/                      # Flask API Server
│   ├── app.py                    # Main application
│   ├── requirements.txt          # Python dependencies
│   ├── gunicorn.conf.py         # Production server config
│   ├── Procfile                 # Render process file
│   ├── runtime.txt              # Python version
│   ├── models/                  # ML models & predictors
│   │   ├── simple_predictor.py  # Toxicity prediction
│   │   ├── best_optimized_models.pkl  # Trained models
│   │   └── meditox_feature.py   # Enhanced features
│   ├── config/                  # Configuration files
│   │   ├── groq.py             # AI configuration
│   │   └── supabase.py         # Database configuration
│   └── .env                     # Environment variables
│
├── frontend/                     # React Application
│   ├── src/
│   │   ├── App.js              # Main app component
│   │   ├── index.css           # Global styles (mobile-responsive)
│   │   ├── config/
│   │   │   └── api.js          # API configuration
│   │   ├── components/         # Reusable components
│   │   │   ├── Layout/        # Layout components
│   │   │   ├── ImageAnalysis.jsx  # OCR features
│   │   │   └── ChemBioBot.jsx     # AI chat
│   │   └── pages/             # Page components
│   │       ├── Home.jsx       # Landing page
│   │       ├── Dashboard.jsx  # Analytics
│   │       ├── Predictions.jsx # Main prediction
│   │       ├── Chat.jsx       # AI assistant
│   │       └── BatchProcessing.jsx  # Batch analysis
│   ├── public/                # Static assets
│   ├── package.json           # Dependencies
│   ├── tailwind.config.js     # Tailwind setup
│   ├── .env.production        # Production config
│   └── .env.development       # Development config
│
├── database/
│   └── schema.sql             # Database schema
│
├── docs/                       # Documentation
│   ├── COMPLETE_PROJECT_REPORT.md
│   ├── api.md
│   └── ROADMAP.md
│
├── render.yaml                 # Render deployment config
├── DEPLOYMENT_GUIDE.md         # Detailed deployment guide
├── MOBILE_RESPONSIVE_CHECKLIST.md  # Mobile optimization
├── build-production.sh         # Build script (Unix)
├── build-production.bat        # Build script (Windows)
└── README.md                   # This file
```

## 🎨 Mobile Responsiveness

### ✅ Implemented Features
- **Responsive Navigation**: Hamburger menu on mobile
- **Touch-Friendly**: 44x44px minimum touch targets
- **Adaptive Layout**: 1-4 column grids based on screen size
- **Safe Areas**: Support for notched devices
- **Optimized Performance**: Lazy loading and code splitting

### 📱 Breakpoints
```css
xs:  475px  /* Small phones */
sm:  640px  /* Large phones */
md:  768px  /* Tablets */
lg:  1024px /* Laptops */
xl:  1280px /* Desktops */
2xl: 1536px /* Large screens */
```

### Testing
```bash
# Local testing
npm start
# Then open Chrome DevTools → Device Toolbar

# Production build test
npm run build
npm run serve
```

## 🔧 Development

### Backend Development
```bash
cd backend

# Activate virtual environment (optional)
python -m venv venv
source venv/bin/activate  # Unix
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py

# Test API
curl http://localhost:5000/api/health
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Analyze bundle size
npm run analyze
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_backend.py
```

### API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Single prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"smiles": "CCO", "molecule_name": "Ethanol"}'

# Get endpoints list
curl http://localhost:5000/api/endpoints

# Get statistics
curl http://localhost:5000/api/stats
```

## 📊 Key Features

### 1. Toxicity Prediction
- **5 Endpoints**: Comprehensive analysis
- **SMILES Input**: Standard chemical notation
- **Confidence Scores**: Prediction reliability
- **AI Analysis**: Groq LLM explanations

### 2. Image Analysis
- **OCR Technology**: Tesseract.js integration
- **Medicine Labels**: Extract ingredients
- **AI Vision**: Groq vision API
- **Chemical Identification**: Automatic SMILES generation

### 3. Natural Language
- **Query Processing**: "painkiller", "toxic solvent"
- **Chemical Mapping**: 40+ chemicals with keywords
- **AI-Powered**: Groq LLM for understanding
- **Smart Suggestions**: Context-aware recommendations

### 4. Batch Processing
- **Multiple Molecules**: Up to 100 compounds
- **CSV Export**: Download results
- **Analytics**: Visualizations and statistics

### 5. AI Chat Assistant
- **Chemistry Expert**: Specialized knowledge
- **Toxicology**: Endpoint explanations
- **Drug Discovery**: ADME properties
- **Real-time**: Instant responses

## 🔐 Environment Variables

### Backend (.env)
```properties
# Required
GROQ_API_KEY=gsk_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Optional
FLASK_ENV=production
FLASK_DEBUG=False
CORS_ORIGINS=https://frontend-url.com
AI_MODEL=llama-3.3-70b-versatile
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=1024
```

### Frontend (.env.production)
```properties
REACT_APP_API_URL=https://backend-url.onrender.com
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

## 🚨 Troubleshooting

### Backend Issues
**Models not loading**
- Ensure `best_optimized_models.pkl` exists in `backend/models/`
- Check file permissions

**Database connection failed**
- Verify Supabase credentials
- Run `database/schema.sql` in Supabase SQL Editor

**CORS errors**
- Add frontend URL to `CORS_ORIGINS`
- Check Render environment variables

### Frontend Issues
**API calls failing**
- Verify `REACT_APP_API_URL` is set correctly
- Check backend is running
- Inspect browser console for errors

**Build failures**
- Clear `node_modules` and reinstall
- Check Node.js version (18+)
- Run `npm run build` locally first

### Deployment Issues
**Render build failing**
- Check Render build logs
- Verify all files are committed to Git
- Ensure environment variables are set

**Free tier sleep mode**
- First request after 15min will be slow
- Consider upgrading to Starter plan ($7/month)

## 📈 Performance

### Metrics
- **Load Time**: < 2 seconds
- **Prediction Time**: < 1 second
- **API Response**: < 500ms
- **Lighthouse Score**: 90+ (mobile)

### Optimization
- Lazy loading components
- Code splitting
- Image optimization
- Gzip compression
- CDN delivery (Render)

## 🛡️ Security

- ✅ HTTPS only (Render enforces)
- ✅ Environment variables secured
- ✅ CORS configured
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

## 💰 Cost Breakdown

### Free Tier (Render)
- **Backend**: Free web service (750 hours, sleeps after 15min)
- **Frontend**: Free static site (100GB bandwidth)
- **Total**: $0/month

### Paid Tier (Recommended for Production)
- **Backend**: Starter ($7/month) - no sleep, better performance
- **Frontend**: Free
- **Database**: Supabase Free (500MB)
- **AI**: Groq (free with limits)
- **Total**: $7/month

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Mobile Responsive Checklist](./MOBILE_RESPONSIVE_CHECKLIST.md) - Mobile optimization
- [API Documentation](./docs/api.md) - API reference
- [Project Report](./docs/COMPLETE_PROJECT_REPORT.md) - Technical documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Gaurav Patil**
- GitHub: [@GauravPatil2515](https://github.com/GauravPatil2515)
- Project: [medtox-scan-ai](https://github.com/GauravPatil2515/medtox-scan-ai)

## 🙏 Acknowledgments

- **Groq** - Fast AI inference
- **Supabase** - Backend-as-a-Service
- **Render** - Cloud hosting
- **React** - Frontend framework
- **Flask** - Backend API
- **Tailwind CSS** - Styling
- **Tesseract.js** - OCR engine

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/GauravPatil2515/medtox-scan-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/GauravPatil2515/medtox-scan-ai/discussions)
- **Email**: support@medtoxai.com

## 🎉 Success Checklist

Before going live, ensure:
- [ ] All environment variables set in Render
- [ ] Database schema created in Supabase
- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] Prediction API works with test SMILES
- [ ] Image analysis functional
- [ ] Chat assistant responding
- [ ] Mobile responsive (test on real device)
- [ ] CORS configured correctly
- [ ] Custom domain configured (optional)

---

**Made with ❤️ for safer drug discovery**

**Version**: 1.0.0  
**Last Updated**: November 12, 2025  
**Status**: Production Ready ✅
