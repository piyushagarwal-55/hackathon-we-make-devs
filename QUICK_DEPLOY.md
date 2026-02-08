# 🚀 Quick Deploy to Render - ShopSage Backend

## ✅ CORS Fixed - No Configuration Needed!
CORS is now set to allow all origins (`*`) - your frontend will work from any URL without CORS issues!

---

## 📋 Environment Variables to Add in Render

### REQUIRED:
```
GOOGLE_API_KEY = AIzaSyAvMclZ2csSLWC0pjmzy4VBkVPEatYKgJE
```

### REQUIRED for Database Features:
```
MONGODB_URI = mongodb+srv://piyushaga2005:Piyush%402005@cluster0.wvhet4s.mongodb.net/
JWT_SECRET_KEY = piyush2005
```

### OPTIONAL:
```
MONGODB_DB_NAME = shopsage
FAL_KEY = 917e0e50-8ea9-4436-9ae4-0a7b03ea3c58:f1b4d888fd0daa33562a65244189e1de
PYTHON_VERSION = 3.11.0
```

---

## 🎯 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy backend to Render"
git push origin main
```

### 2. Create Render Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### 3. Configure Service
- **Name:** `shopsage-backend`
- **Region:** Oregon (or closest to you)
- **Branch:** `main`
- **Root Directory:** `OnlineBoutiqueAgent/ecommerce_agent`
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn simple_server:app --host 0.0.0.0 --port $PORT`
- **Instance Type:** Free

### 4. Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add the variables listed above.

### 5. Deploy!
Click **"Create Web Service"** and wait 2-5 minutes for deployment.

---

## 🔗 Get Your Backend URL

After deployment, Render will give you a URL like:
```
https://shopsage-backend.onrender.com
```

Copy this URL!

---

## 🌐 Update Frontend

Update your Vercel environment variable:

1. Go to Vercel project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_AGENT_BACKEND_URL`:
   ```
   https://shopsage-backend.onrender.com
   ```
3. Redeploy frontend

---

## ✅ Test Your Deployment

### Health Check:
```bash
curl https://your-backend-url.onrender.com/health
```

Expected:
```json
{"status": "healthy", "components": 15}
```

### Test Chat:
```bash
curl -X POST https://your-backend-url.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show me sunglasses"}'
```

---

## 🎉 Done!

Your backend is now live and accessible from anywhere - no CORS issues! 🚀

### Important Notes:
- ✅ CORS allows all origins - works from any frontend
- ✅ Free tier spins down after 15 min inactivity (30-60s cold start)
- ✅ MongoDB optional - works in memory mode without it
- ✅ All API endpoints accessible at your Render URL

---

## 📱 Need Help?

Check Render logs:
1. Render Dashboard → Your Service → Logs
2. Look for:
   - ✅ "MongoDB enabled" - Database working
   - ⚠️ "MongoDB disabled" - Memory-only mode
   - ❌ Any error messages in red
