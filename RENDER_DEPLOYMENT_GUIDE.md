# 🚀 Render Deployment Guide - CampusConnect

Complete step-by-step guide to deploy your full-stack application on Render.

---

## 📋 Pre-Deployment Checklist

✅ GitHub repository pushed with latest code  
✅ `.env` file ready (will add to Render)  
✅ MongoDB Atlas database accessible  
✅ Cloudinary account configured  

---

## 🎯 Deployment Strategy

**Two Services on Render:**
1. **Backend** (Node.js/Express API) - Web Service
2. **Frontend** (React/Vite) - Static Site

---

## 📦 Part 1: Backend Deployment

### Step 1: Create Backend Web Service

1. **Login to Render**
   - Go to https://render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository: `cs350892/CampusConnect`
   - Click **"Connect"**

3. **Configure Backend Service**
   ```
   Name:               campusconnect-backend
   Region:             Singapore (or closest to you)
   Branch:             master
   Root Directory:     backend
   Runtime:            Node
   Build Command:      npm install
   Start Command:      node src/index.js
   Instance Type:      Free
   ```

### Step 2: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

```env
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://cs350892_db_user:3GyBQN7Ymj8hdSlz@cluster0.pi4t7iu.mongodb.net/campus-connect?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=72d174f8ae129894ec4a42ca6e59a19528cc36a101c05e9c5e396452e6097510dc526b767f54a39d1c38f18aa05d448eb6c10b681c3182967475edd5652cc1a7
JWT_EXPIRE=30d

# Frontend URL (UPDATE THIS AFTER FRONTEND DEPLOYMENT)
FRONTEND_URL=https://your-frontend-url.onrender.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=CampusConnect <noreply@campusconnect.com>

# Admin Configuration
ADMIN_EMAIL=admin@campusconnect.com
ADMIN_PASSWORD=Admin@123

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dnwhfrhah
CLOUDINARY_API_KEY=815672369367378
CLOUDINARY_API_SECRET=hvM_9TTaLEuEAgcBzgypoxixU5Y

# Port (Render automatically assigns this)
PORT=5000
```

### Step 3: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. **Copy your backend URL**: `https://campusconnect-backend-xxxx.onrender.com`

### Step 4: Test Backend

Open in browser:
```
https://campusconnect-backend-xxxx.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "CampusConnect API is running",
  "timestamp": "2025-11-28T..."
}
```

---

## 🎨 Part 2: Frontend Deployment

### Step 1: Update Frontend API URL

**Before deploying frontend**, update the API URL:

**File: `frontend/.env.production`** (create this file)
```env
VITE_API_URL=https://campusconnect-backend-xxxx.onrender.com/api
```

**Commit and push:**
```bash
git add frontend/.env.production
git commit -m "Add production API URL"
git push
```

### Step 2: Create Static Site

1. **In Render Dashboard**
   - Click **"New +"** → **"Static Site"**
   - Select your GitHub repository: `cs350892/CampusConnect`

2. **Configure Frontend Service**
   ```
   Name:               campusconnect-frontend
   Region:             Singapore
   Branch:             master
   Root Directory:     frontend
   Build Command:      npm install && npm run build
   Publish Directory:  dist
   ```

3. **Add Environment Variable**
   ```
   VITE_API_URL=https://campusconnect-backend-xxxx.onrender.com/api
   ```

### Step 3: Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (3-5 minutes)
3. **Copy your frontend URL**: `https://campusconnect-frontend-xxxx.onrender.com`

---

## 🔄 Part 3: Update Backend CORS

### Update FRONTEND_URL in Backend

1. Go to **Backend Web Service** in Render
2. Click **"Environment"**
3. Update `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://campusconnect-frontend-xxxx.onrender.com
   ```
4. Click **"Save Changes"**
5. Backend will automatically redeploy

---

## ✅ Part 4: Verify Deployment

### Test Backend APIs

```bash
# Health check
curl https://campusconnect-backend-xxxx.onrender.com/api/health

# Get students
curl https://campusconnect-backend-xxxx.onrender.com/api/students

# Get alumni
curl https://campusconnect-backend-xxxx.onrender.com/api/alumni
```

### Test Frontend

1. Open: `https://campusconnect-frontend-xxxx.onrender.com`
2. Check student registration with image upload
3. Check alumni registration
4. Verify images display correctly

---

## 📁 Required File Structure

Make sure you have these files committed:

```
CampusConnect/
├── backend/
│   ├── package.json          ✅
│   ├── src/
│   │   └── index.js          ✅
│   └── .env.example          ✅ (template, don't include actual .env)
├── frontend/
│   ├── package.json          ✅
│   ├── vite.config.js        ✅
│   ├── index.html            ✅
│   └── .env.production       ✅ (create this)
└── README.md
```

---

## 🔧 Important Configuration Files

### backend/package.json
Make sure you have:
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### frontend/vite.config.js
Should have:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

---

## 🌐 MongoDB Atlas Configuration

### Allow Render IP Addresses

1. Go to MongoDB Atlas Dashboard
2. **Network Access** → **Add IP Address**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Or add specific Render IPs (check Render docs)

---

## 🎯 Post-Deployment Checklist

### Backend Service
- [ ] Service is live and running
- [ ] Health endpoint working: `/api/health`
- [ ] MongoDB connected successfully
- [ ] Cloudinary configured (check logs: "✓ Cloudinary configured")
- [ ] CORS allows frontend URL
- [ ] All API endpoints accessible

### Frontend Service
- [ ] Site loads successfully
- [ ] API calls work (check Network tab)
- [ ] Student registration works
- [ ] Alumni registration works
- [ ] Image uploads to Cloudinary
- [ ] Images display on cards

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Not Starting
**Error**: `Application failed to respond`

**Solution**:
```bash
# Check logs in Render dashboard
# Make sure PORT is set correctly
# Verify index.js listens on process.env.PORT
```

In `backend/src/index.js`:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Issue 2: CORS Errors
**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
Update `FRONTEND_URL` environment variable in backend to match your frontend URL exactly.

### Issue 3: MongoDB Connection Failed
**Error**: `MongoServerError: bad auth`

**Solution**:
1. Check `MONGO_URI` is correct
2. Verify MongoDB user has read/write permissions
3. Allow access from anywhere (0.0.0.0/0) in Network Access

### Issue 4: Image Upload Fails
**Error**: `Cloudinary not configured`

**Solution**:
1. Verify all 3 Cloudinary variables are set
2. Check backend logs for "✓ Cloudinary configured"
3. Restart backend service if needed

### Issue 5: Frontend Shows Blank Page
**Error**: Blank white page

**Solution**:
1. Check browser console for errors
2. Verify `VITE_API_URL` is correct
3. Check if API is accessible
4. Rebuild frontend

---

## 🔄 Redeployment Process

### When You Update Code

**Automatic Deployment:**
```bash
git add .
git commit -m "Your changes"
git push
```
Render will automatically detect changes and redeploy.

**Manual Deployment:**
1. Go to Render Dashboard
2. Select your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 📊 Monitoring

### Check Logs

**Backend Logs:**
1. Go to Backend service
2. Click **"Logs"** tab
3. Look for:
   ```
   ✓ Cloudinary configured successfully
   ✅ Connected to MongoDB
   🚀 CampusConnect Backend Server Started
   ```

**Frontend Logs:**
1. Go to Static Site
2. Click **"Logs"** tab
3. Check for build errors

### Monitor Performance

- **Metrics** tab shows CPU, memory usage
- **Events** tab shows deployment history

---

## 💰 Free Tier Limits

**Render Free Plan:**
- ✅ 750 hours/month (enough for 1 service)
- ✅ Auto-sleep after 15 minutes of inactivity
- ✅ Cold start time: ~30 seconds
- ⚠️ **Note**: Backend will sleep when inactive

**MongoDB Atlas Free:**
- ✅ 512 MB storage
- ✅ Shared cluster

**Cloudinary Free:**
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month

---

## 🚀 Going Live Checklist

Before sharing with users:

- [ ] Test all features on production
- [ ] Update `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- [ ] Configure real email credentials
- [ ] Test student registration end-to-end
- [ ] Test alumni registration end-to-end
- [ ] Test image uploads
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Set up custom domain (optional)

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ All secrets in environment variables
- ✅ Never commit `.env` files
- ✅ Use strong JWT secret

### 2. CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 3. MongoDB
- ✅ Strong password
- ✅ Least privilege access
- ✅ Regular backups

---

## 📞 Support & Resources

**Render Documentation:**
- https://render.com/docs

**Common Commands:**
```bash
# View backend logs
render logs <service-id>

# Restart service
render restart <service-id>
```

**Discord/Support:**
- Render Community Discord
- GitHub Issues

---

## 🎉 Success!

Your CampusConnect app is now live! 🚀

**URLs to Share:**
- Frontend: `https://campusconnect-frontend-xxxx.onrender.com`
- API: `https://campusconnect-backend-xxxx.onrender.com/api`

**Admin Panel:**
- Login with: `admin@campusconnect.com` / `Admin@123`

---

## 📝 Quick Summary

1. ✅ Deploy Backend → Get URL
2. ✅ Create `.env.production` with backend URL
3. ✅ Deploy Frontend → Get URL
4. ✅ Update backend `FRONTEND_URL`
5. ✅ Test everything
6. ✅ Share with users!

**Deployment Time:** ~15-20 minutes total

---

**Good luck with your deployment! 🎊**
