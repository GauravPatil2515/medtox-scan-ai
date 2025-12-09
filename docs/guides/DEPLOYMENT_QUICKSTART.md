# ⚡ Quick Start - Deploy MedToXAi to Render in 15 Minutes

## 🎯 Prerequisites (5 minutes)

1. **GitHub Account** - [Sign up](https://github.com/signup) if needed
2. **Render Account** - [Sign up](https://dashboard.render.com/register) (free)
3. **Groq API Key** - [Get free key](https://console.groq.com/keys)
4. **Supabase Account** - [Sign up](https://supabase.com/dashboard) (optional but recommended)

## 🚀 Deployment Steps (10 minutes)

### Step 1: Push to GitHub (2 minutes)

```bash
# Navigate to your project
cd "c:\Users\GAURAV PATIL\Downloads\model"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Ready for Render deployment"

# Push to GitHub
git remote add origin https://github.com/GauravPatil2515/medtox-scan-ai.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render (3 minutes)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render automatically detects `render.yaml`
5. Click **"Apply"**

### Step 3: Add Environment Variables (3 minutes)

In Render dashboard, go to each service and add:

**Backend Service Environment Variables:**
```
GROQ_API_KEY=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
SUPABASE_URL=https://ifryersmyctokdkvysvx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FLASK_ENV=production
FLASK_DEBUG=False
CORS_ORIGINS=https://medtoxai-frontend.onrender.com
AI_MODEL=llama-3.3-70b-versatile
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=1024
```

**Frontend Service Environment Variables:**
```
REACT_APP_API_URL=https://medtoxai-backend.onrender.com
```

### Step 4: Setup Database (2 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project → SQL Editor
3. Copy & paste from `database/schema.sql`
4. Click **"Run"**

✅ **Done! Your app is deploying!**

## 🧪 Test Your Deployment

Wait 5-10 minutes for deployment to complete, then:

### Test Backend:
```bash
curl https://medtoxai-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-12T...",
  "predictor_loaded": true
}
```

### Test Frontend:
Open: `https://medtoxai-frontend.onrender.com`

### Test Prediction:
1. Go to Predictions page
2. Enter SMILES: `CCO`
3. Click "Predict"
4. See results!

## 🎉 Success!

Your MedToXAi platform is now live at:
- **Frontend**: `https://medtoxai-frontend.onrender.com`
- **Backend API**: `https://medtoxai-backend.onrender.com`

## 🐛 Troubleshooting

### Issue: Build Failed
**Solution**: Check Render build logs
- Click on service → "Logs" tab
- Look for error messages
- Common fixes:
  - Verify all files committed to Git
  - Check environment variables are set
  - Ensure Python 3.11 in `runtime.txt`

### Issue: Frontend Shows Blank Page
**Solution**: 
1. Open browser console (F12)
2. Look for errors
3. Verify `REACT_APP_API_URL` is set correctly
4. Check Network tab for failed requests

### Issue: CORS Errors
**Solution**:
1. Copy your frontend URL
2. Update backend `CORS_ORIGINS` with frontend URL
3. Save and redeploy backend

### Issue: API Calls Failing
**Solution**:
- Verify backend is running (check health endpoint)
- Check backend environment variables
- Ensure GROQ_API_KEY is valid

## 📚 Next Steps

1. **Test Mobile**: Open on your phone
2. **Add Custom Domain**: [Render Docs](https://render.com/docs/custom-domains)
3. **Monitor Performance**: Check Render dashboard
4. **Share Your Work**: Add URLs to your portfolio

## 🆘 Need Help?

- 📖 [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
- ✅ [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- 📱 [Mobile Guide](./MOBILE_RESPONSIVE_CHECKLIST.md)
- 💬 [GitHub Issues](https://github.com/GauravPatil2515/medtox-scan-ai/issues)

## 💡 Tips

- **Free Tier**: App sleeps after 15min. First request will be slow (cold start ~30s)
- **Upgrade**: $7/month Starter tier = always on, better performance
- **Logs**: Always check Render logs for debugging
- **Database**: Supabase free tier = 500MB, plenty for testing

---

**Deployment Time**: ~15 minutes  
**Cost**: $0 (Free tier)  
**Difficulty**: Easy ⭐⭐⭐☆☆

✨ **You're ready to deploy!** ✨
