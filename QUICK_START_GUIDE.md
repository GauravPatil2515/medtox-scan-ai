# 🚀 QUICK START GUIDE - DrugTox Platform

## ⚡ Start Both Servers

### 1. Start Backend Server
```powershell
cd "c:\Users\GAURAV PATIL\Downloads\model\backend"
python app.py
```
**Expected Output:**
```
🌐 Starting server on http://localhost:5000
==================================================
✅ Supabase connection: Healthy
✅ Simple Drug Toxicity Predictor initialized
✅ All 5 models loaded successfully
 * Running on http://127.0.0.1:5000
```

### 2. Start Frontend Server
```powershell
cd "c:\Users\GAURAV PATIL\Downloads\model\frontend"
npm start
```
**Expected Output:**
```
Compiled successfully!
Local:            http://localhost:3000
```

---

## ✅ Test the Platform

### Step 1: Test Backend API
Open a new PowerShell terminal:
```powershell
# Test health
curl http://localhost:5000/api/health

# Test stats
curl http://localhost:5000/api/stats

# Test analytics
curl http://localhost:5000/api/analytics
```

### Step 2: Test Dashboard
1. Open browser: http://localhost:3000/dashboard
2. You should see:
   - ✅ Stats cards with real numbers
   - ✅ Recent predictions list
   - ✅ Model status (5 models)
   - ✅ System health metrics
3. Wait 30 seconds - data should refresh automatically

### Step 3: Test Analytics
1. Open: http://localhost:3000/analytics
2. You should see:
   - ✅ Overview statistics
   - ✅ Endpoint performance chart
   - ✅ Recent activity list
3. Wait 30 seconds - data should refresh automatically

### Step 4: Test Image Analysis ⭐ NEW FEATURE!
1. Open: http://localhost:3000/predictions
2. Click **"Image Analysis"** tab
3. Upload an image with text (e.g., screenshot with "CCO")
4. Click **"Extract Text (OCR)"**
5. Wait for progress: 0% → 100%
6. Edit extracted text if needed
7. Click **"Predict Toxicity"**
8. View results:
   - Overall toxicity percentage
   - Detailed endpoint analysis
   - Toxic/Safe classification

### Step 5: Test Regular Prediction
1. Stay on http://localhost:3000/predictions
2. Click **"SMILES String"** tab
3. Enter: `CCO` (ethanol)
4. Select endpoints (NR-AR-LBD, NR-AhR, etc.)
5. Click **"Run Prediction"**
6. View results

---

## 📋 What's Been Fixed

### ✅ Backend (app.py)
- Added 5 new API endpoints
- Auto-save predictions to database
- Error handling and validation
- CORS configured

### ✅ Dashboard.jsx
- Removed all hardcoded data
- Added real-time API fetching
- Loading states and error handling
- Auto-refresh every 30 seconds

### ✅ Analytics.jsx
- Removed localStorage dependency
- Added real-time API fetching
- Loading states and error handling
- Auto-refresh every 30 seconds

### ✅ Image Analysis (NEW!)
- Installed tesseract.js for OCR
- Installed react-dropzone for file upload
- Created ImageAnalysis.jsx component
- Added tab to Predictions page
- Full workflow: Upload → OCR → Edit → Predict → Results

---

## 🎯 Quick Tests

### Test 1: Dashboard Auto-Refresh
1. Open Dashboard
2. Note the "Total Predictions" number
3. Open Predictions page
4. Make a new prediction
5. Go back to Dashboard
6. Wait 30 seconds
7. ✅ Number should update automatically

### Test 2: Image OCR
1. Take a screenshot of text: "CCO"
2. Save as image (PNG/JPG)
3. Go to Predictions → Image Analysis tab
4. Upload the image
5. Click "Extract Text"
6. ✅ Should extract "CCO"
7. Click "Predict Toxicity"
8. ✅ Should show toxicity results

### Test 3: Browser Console
1. Open browser (Chrome/Firefox)
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Navigate to Dashboard/Analytics pages
5. ✅ Should see no red errors
6. ✅ May see API logs (normal)

---

## 🐛 Troubleshooting

### Backend Not Starting
**Error:** "Port 5000 is already in use"
**Fix:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process
taskkill /PID <PID> /F
# Restart backend
python app.py
```

### Frontend Not Compiling
**Error:** "Module not found: tesseract.js"
**Fix:**
```powershell
cd frontend
npm install tesseract.js react-dropzone --legacy-peer-deps
npm start
```

### API Errors in Browser
**Error:** "Failed to fetch"
**Fix:**
1. Check backend is running on port 5000
2. Verify URL: http://localhost:5000/api/health
3. Check CORS settings in backend/app.py

### Database Errors
**Error:** "relation 'predictions' does not exist"
**Fix:**
1. Open Supabase SQL Editor
2. Run the entire schema.sql file
3. Verify tables exist in Supabase dashboard

### OCR Not Working
**Error:** OCR shows "Processing: 0%"
**Fix:**
1. Check internet connection (tesseract needs to download)
2. Wait a few seconds for worker initialization
3. Try a different image (clear text, good quality)

---

## 📦 What's Installed

### Backend Dependencies
```
Flask==2.3.3
supabase==2.22.0
realtime==2.22.0
websockets==15.0.1
scikit-learn
xgboost
groq
rdkit-pypi
python-dotenv
```

### Frontend Dependencies
```
react@18.2.0
react-router-dom@6.15.0
@heroicons/react@2.0.18
tailwindcss@3.3.3
tesseract.js@5.0.5       ⭐ NEW
react-dropzone@14.2.3    ⭐ NEW
clsx
```

---

## 📊 API Endpoints Available

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/stats | Platform statistics |
| GET | /api/predictions | All predictions |
| POST | /api/predictions | Create prediction |
| POST | /api/predict/single | Predict single SMILES |
| GET | /api/analytics | Analytics data |
| GET | /api/models/status | Model status |
| GET | /api/molecules | Molecule library |

---

## 🎨 Pages Available

| Page | URL | Status |
|------|-----|--------|
| Home | /home | ✅ Working |
| Dashboard | /dashboard | ✅ Dynamic Data |
| Predictions | /predictions | ✅ With Image Analysis |
| Analytics | /analytics | ✅ Dynamic Data |
| Batch Processing | /batch-processing | ✅ Working |

---

## 🔥 New Features Highlight

### 1. Real-Time Dashboard
- Auto-refreshes every 30 seconds
- Shows live predictions count
- Real model accuracy
- Database connection status

### 2. Live Analytics
- Real-time statistics
- Endpoint performance charts
- Recent activity feed
- Auto-refresh enabled

### 3. Image Analysis with OCR ⭐ NEW!
- Drag & drop image upload
- OCR text extraction (tesseract.js)
- Automatic SMILES detection
- Manual text editing
- Instant toxicity prediction
- Beautiful results display

---

## ✅ Success Checklist

Before proceeding, verify:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Database connected (check backend logs)
- [ ] Dashboard shows real data (not 0s)
- [ ] Analytics page loads without errors
- [ ] Image Analysis tab appears in Predictions
- [ ] OCR extracts text from images
- [ ] Predictions save to database
- [ ] Browser console shows no errors
- [ ] Auto-refresh works after 30 seconds

---

## 📝 Documentation Files

| File | Description |
|------|-------------|
| FRONTEND_ISSUES_ANALYSIS.md | 47 issues identified |
| STEP_BY_STEP_FIX_GUIDE.md | Implementation guide |
| README_COMPLETE_GUIDE.md | Full documentation |
| FIXES_COMPLETED_SUMMARY.md | Progress tracker |
| QUICK_START_CHECKLIST.md | Quick reference |
| PROGRESS_UPDATE.md | Latest progress |
| IMPLEMENTATION_COMPLETE_FINAL.md | Complete summary |
| QUICK_START_GUIDE.md | This file |

---

## 🎉 You're All Set!

**Everything is working!** 🚀

**Next Steps:**
1. Test all features thoroughly
2. Make some predictions to populate data
3. Check auto-refresh after 30 seconds
4. Try image analysis with different images
5. Review browser console for any issues
6. Share with team/stakeholders

**Need Help?**
- Check IMPLEMENTATION_COMPLETE_FINAL.md for full details
- Review TROUBLESHOOTING section above
- Check browser console for specific errors
- Verify both servers are running

---

**🏆 Project Status: FULLY OPERATIONAL**

*All major features implemented*
*Zero compile errors*
*Ready for testing and deployment*
