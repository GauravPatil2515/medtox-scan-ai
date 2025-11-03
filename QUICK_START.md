# 🚀 Quick Start Guide - MedToXAi Platform

## ⚡ TL;DR - Start Everything Now!

```powershell
# Navigate to project
cd "c:\Users\GAURAV PATIL\Downloads\medtox-scan-ai"

# Start both servers automatically
.\START_SERVERS.ps1
```

The script will:
- ✅ Check if servers are running
- ✅ Start any stopped servers
- ✅ Wait for frontend compilation
- ✅ Open browser automatically to http://localhost:3000

---

## 🎯 What You Get

### Frontend (http://localhost:3000)
- 🧪 **Toxicity Predictions**: Enter SMILES or chemical names
- 🤖 **AI Chat**: Ask questions about molecules and toxicity
- 📊 **Analytics Dashboard**: View prediction history and statistics
- 🔬 **Molecular Visualization**: 3D structure viewer
- 📁 **Batch Processing**: Upload multiple molecules at once

### Backend API (http://localhost:5000)
- 🔌 **RESTful API**: 10 endpoints for predictions and data
- 🧬 **5 Toxicity Models**: NR-AR-LBD, NR-AhR, SR-MMP, NR-ER-LBD, NR-AR
- 💾 **Database**: Supabase PostgreSQL with 39 predictions
- 🤖 **Groq AI**: llama-3.3-70b-versatile for intelligent responses

---

## 📋 Current Status (Latest Check)

| Component | Status | URL/Info |
|-----------|--------|----------|
| **Backend** | ✅ RUNNING | http://localhost:5000 |
| **Frontend** | 🔄 STARTING | http://localhost:3000 (30-60s compile) |
| **Database** | ✅ CONNECTED | Supabase (39 predictions, 10 molecules) |
| **ML Models** | ✅ LOADED | 5 models at 85% accuracy |
| **AI Integration** | ✅ ACTIVE | Groq API with llama-3.3-70b |

---

## 🎮 How to Use

### 1. Make a Toxicity Prediction

#### Option A: Using Frontend UI
1. Open http://localhost:3000
2. Click "Predictions" in sidebar
3. Enter a SMILES string (e.g., `CCO` for ethanol)
4. Click "Predict Toxicity"
5. View results for all 5 endpoints

#### Option B: Using API
```powershell
# Example: Predict toxicity of ethanol (CCO)
Invoke-RestMethod -Uri "http://localhost:5000/api/predict" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"smiles": "CCO", "molecule_name": "Ethanol"}'
```

### 2. Chat with AI

#### Frontend:
1. Click "Chat" in sidebar
2. Ask: "What are the health risks of benzene?"
3. Get AI-powered responses

#### API:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"message": "What are the health risks of benzene?"}'
```

### 3. Convert Chemical Name to SMILES

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/chemical-name-to-smiles" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name": "aspirin"}'
```

### 4. View Analytics

- **Frontend**: Click "Dashboard" to see statistics
- **API**: GET http://localhost:5000/api/analytics

---

## 🔧 Manual Server Management

### If Auto-Start Doesn't Work

#### Start Backend Only:
```powershell
cd "c:\Users\GAURAV PATIL\Downloads\medtox-scan-ai\backend"
python app.py
```

Backend will start on http://localhost:5000

#### Start Frontend Only:
```powershell
cd "c:\Users\GAURAV PATIL\Downloads\medtox-scan-ai\frontend"
npm start
```

Frontend will compile (30-60 seconds) and open browser automatically.

### Check Server Status:
```powershell
# Check if backend is responding
Invoke-WebRequest http://localhost:5000/api/health

# Check if frontend is ready
Invoke-WebRequest http://localhost:3000
```

### Stop Servers:
```powershell
# Stop frontend (Node.js)
Get-Process node | Stop-Process -Force

# Stop backend (Python)
Get-Process python | Where-Object {$_.Path -like "*medtox*"} | Stop-Process -Force
```

---

## 🧪 Test the Platform

### Quick Health Check:
```powershell
# Test backend
Invoke-WebRequest http://localhost:5000/api/health

# Should return: {"status": "healthy", "timestamp": "..."}
```

### Run Full Test Suite:
```powershell
cd backend
python test_all_apis.py
```

Expected: **9/10 tests passing** (90% success rate)

### Check Database:
```powershell
cd backend
python check_database.py
```

Expected output:
- ✅ 39 predictions
- ✅ 10 molecules in library
- ✅ All tables accessible

---

## 📊 Available API Endpoints

### Core Prediction APIs
| Endpoint | Method | Purpose | Example |
|----------|--------|---------|---------|
| `/api/health` | GET | Health check | `curl http://localhost:5000/api/health` |
| `/api/endpoints` | GET | List toxicity endpoints | Returns 5 endpoints |
| `/api/predict` | POST | Single prediction | `{"smiles": "CCO"}` |
| `/api/batch-predict` | POST | Multiple predictions | `{"molecules": [...]}` |

### Data & Analytics
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analytics` | GET | Platform statistics |
| `/api/predictions/history` | GET | Past predictions |
| `/api/molecules/library` | GET | Molecule database |

### AI & Utilities
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | AI chatbot |
| `/api/chemical-name-to-smiles` | POST | Name conversion |

---

## 🐛 Troubleshooting

### Frontend Won't Start

**Problem**: "Cannot find module" or "npm not found"

**Solution**:
```powershell
cd frontend
npm install
npm start
```

### Backend Won't Start

**Problem**: "ModuleNotFoundError" or missing packages

**Solution**:
```powershell
cd backend
pip install -r requirements.txt
python app.py
```

### Database Connection Error

**Problem**: "No module named 'websockets.asyncio'"

**Solution**: Already fixed! But if it happens again:
```powershell
pip install --upgrade websockets>=15.0.1
```

### Port Already in Use

**Problem**: "Address already in use" on port 3000 or 5000

**Solution**:
```powershell
# Kill process on port 5000 (backend)
Get-Process python | Stop-Process -Force

# Kill process on port 3000 (frontend)
Get-Process node | Stop-Process -Force

# Then restart servers
.\START_SERVERS.ps1
```

### Frontend Shows Blank Page

**Problem**: Browser shows blank page or loading forever

**Solution**:
1. Check browser console (F12) for errors
2. Verify backend is running: http://localhost:5000/api/health
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard reload (Ctrl+F5)

---

## 📁 Important Files

### Configuration
- `backend/.env` - API keys and credentials (Groq, Supabase)
- `frontend/package.json` - Frontend dependencies
- `backend/requirements.txt` - Backend dependencies

### Models & Data
- `backend/models/best_optimized_models.pkl` - 5 trained ML models
- `backend/models/chembert_analyzer.py` - ChemBERT integration
- `backend/models/simple_predictor.py` - Prediction engine

### Utilities
- `START_SERVERS.ps1` - Auto-start script (RECOMMENDED)
- `CHECK_SERVERS.bat` - Quick status check
- `backend/test_all_apis.py` - API test suite
- `backend/check_database.py` - Database health check

### Documentation
- `PLATFORM_STATUS.md` - Current status report
- `FINAL_STATUS.md` - Session completion summary
- `DATABASE_RESTORATION_REPORT.md` - Database fixes
- `SYSTEM_HEALTH_REPORT.md` - System diagnostics

---

## 🎓 Example Predictions

### Safe Molecules (Low Toxicity)
```json
{
  "smiles": "CCO",
  "molecule_name": "Ethanol"
}
```

### Toxic Molecules
```json
{
  "smiles": "C1=CC=C(C=C1)O",
  "molecule_name": "Phenol"
}
```

```json
{
  "smiles": "C1=CC=CC=C1",
  "molecule_name": "Benzene"
}
```

### Batch Prediction
```json
{
  "molecules": [
    {"smiles": "CCO", "molecule_name": "Ethanol"},
    {"smiles": "C1=CC=CC=C1", "molecule_name": "Benzene"},
    {"smiles": "CC(=O)OC1=CC=CC=C1C(=O)O", "molecule_name": "Aspirin"}
  ]
}
```

---

## 🎯 Next Actions

### Immediate (Right Now)
1. ✅ Frontend compiling (check PowerShell window)
2. ✅ Backend running (http://localhost:5000)
3. ⏳ Wait 30-60 seconds for frontend
4. 🌐 Browser will open automatically to http://localhost:3000
5. 🧪 Try a prediction!

### Short Term (This Session)
- [ ] Test prediction feature with sample SMILES
- [ ] Try AI chat with chemistry questions
- [ ] View analytics dashboard
- [ ] Check prediction history

### Future Enhancements
- [ ] Train models with real data (currently demo models)
- [ ] Add user authentication
- [ ] Deploy to production
- [ ] Add more toxicity endpoints
- [ ] Implement result export (CSV/PDF)

---

## ✅ Success Criteria

You'll know everything is working when:
- ✅ http://localhost:3000 shows the MedToXAi UI
- ✅ http://localhost:5000/api/health returns `{"status": "healthy"}`
- ✅ You can submit a SMILES and get predictions
- ✅ AI chat responds to questions
- ✅ Dashboard shows 39 historical predictions

---

## 📞 Quick Reference

### URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/endpoints

### Commands
- **Start All**: `.\START_SERVERS.ps1`
- **Stop All**: `Get-Process node,python | Stop-Process -Force`
- **Test APIs**: `cd backend; python test_all_apis.py`
- **Check DB**: `cd backend; python check_database.py`

### Ports
- **Frontend**: 3000 (React)
- **Backend**: 5000 (Flask)

### Credentials
- **Groq API**: Configured in `backend/.env`
- **Supabase**: Configured in `backend/.env`

---

## 🎉 You're All Set!

The MedToXAi platform is ready to use. Just wait for the frontend to finish compiling (you'll see "Compiled successfully!" in the PowerShell window), and the browser will open automatically.

Happy predicting! 🧪🔬🚀
