# ✅ Cloudinary Image Upload - Complete Setup Guide

## 🎉 What I Fixed

Your Cloudinary credentials were **NOT in the .env file**. I've added them now!

---

## 📝 What Was Added to .env

```env
# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=dnwhfrhah
CLOUDINARY_API_KEY=815672369367378
CLOUDINARY_API_SECRET=hvM_9TTaLEuEAgcBzgypoxixU5Y
```

---

## 🚀 How to Start Backend (IMPORTANT!)

### Step 1: Stop Current Backend
Press `Ctrl + C` in your backend terminal to stop the server.

### Step 2: Restart Backend
```bash
cd backend
npm run dev
```

### Step 3: Verify Cloudinary is Configured
Look for this line in your terminal:
```
✓ Cloudinary configured
```

If you see this, you're good to go! ✅

If you see:
```
⚠ Cloudinary credentials not found - image upload will be disabled
```
Then the .env file is not being read. Make sure you're in the `backend` folder.

---

## 🧪 Testing in Postman

### Quick Test (1 minute)

**1. Test if Upload Route Works:**
```
GET http://localhost:5000/api/upload/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Upload route is accessible!",
  "cloudinaryConfigured": true  ← This should be true!
}
```

---

**2. Upload an Image:**

**Request Settings:**
- **Method:** POST
- **URL:** http://localhost:5000/api/upload
- **Body:** form-data (NOT raw JSON!)

**Body Configuration:**
| Key | Type | Value |
|-----|------|-------|
| image | File | [Select any .jpg or .png file] |

**IMPORTANT:** 
- The key name MUST be `image` (lowercase)
- The type MUST be `File` (select from dropdown, not Text)

---

**3. Expected Success Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "url": "https://res.cloudinary.com/dnwhfrhah/image/upload/v1732665432/campus-connect/xyz123.jpg",
  "public_id": "campus-connect/xyz123"
}
```

**✅ Copy this URL!** You'll use it to test student/alumni registration.

---

## 📸 How to Use Image in Registration

### Student Registration Example

**Request:**
```
POST http://localhost:5000/api/student/register
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Test Student",
  "email": "teststudent@example.com",
  "password": "Test@123",
  "phone": "9876543210",
  "department": "Computer Science",
  "year": 3,
  "image": "https://res.cloudinary.com/dnwhfrhah/image/upload/v1732665432/campus-connect/xyz123.jpg"
}
```

**Response will include the image URL:**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "student": {
    "name": "Test Student",
    "email": "teststudent@example.com",
    "image": "https://res.cloudinary.com/dnwhfrhah/image/upload/v1732665432/campus-connect/xyz123.jpg",
    ...
  }
}
```

---

### Alumni Registration Example

**Request:**
```
POST http://localhost:5000/api/alumni/register
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Test Alumni",
  "email": "testalumni@example.com",
  "password": "Test@123",
  "phone": "9876543211",
  "batch": 2020,
  "company": "Google",
  "role": "Software Engineer",
  "techStack": ["JavaScript", "React", "Node.js"],
  "linkedIn": "https://linkedin.com/in/testalumni",
  "image": "https://res.cloudinary.com/dnwhfrhah/image/upload/v1732665432/campus-connect/abc456.jpg"
}
```

---

## 🎯 Complete Testing Workflow

```
1. Restart Backend Server
   ↓
2. Verify "✓ Cloudinary configured" in logs
   ↓
3. Test GET /api/upload/test (should return cloudinaryConfigured: true)
   ↓
4. Upload Image via POST /api/upload (form-data with image file)
   ↓
5. Copy the returned URL
   ↓
6. Register Student/Alumni with that image URL
   ↓
7. View in Frontend - Image should display in cards!
```

---

## 🐛 Troubleshooting

### Error: "Image upload service not configured"

**Cause:** Backend didn't load Cloudinary credentials

**Solution:**
1. Make sure .env file is in `backend/` folder (not root)
2. Restart backend: `Ctrl+C` → `npm run dev`
3. Check for "✓ Cloudinary configured" in logs

---

### Error: "No file uploaded"

**Cause:** File not attached properly in Postman

**Solution:**
- Body type must be `form-data` (not raw JSON)
- Key must be exactly `image`
- Type must be `File` (not Text)
- A file must be selected

---

### Error: "Network Error" or "ERR_CONNECTION_REFUSED"

**Cause:** Backend not running

**Solution:**
```bash
cd backend
npm run dev
```

Wait until you see:
```
🚀 CampusConnect Backend Server Started
🌐 Server URL: http://localhost:5000
```

---

### Error: "Only image files are allowed"

**Cause:** Tried to upload non-image file

**Solution:**
- Upload only: .jpg, .jpeg, .png, .gif, .webp
- Not: .pdf, .txt, .doc, etc.

---

## ✅ Success Indicators

When everything works correctly:

1. **Backend Logs Show:**
   ```
   ✓ Cloudinary configured
   Loading uploadRoutes (PUBLIC)...
   ✓ uploadRoutes loaded
   ```

2. **Postman GET /api/upload/test Returns:**
   ```json
   { "cloudinaryConfigured": true }
   ```

3. **Postman POST /api/upload Returns:**
   ```json
   {
     "success": true,
     "url": "https://res.cloudinary.com/..."
   }
   ```

4. **Frontend Works:**
   - File input allows selecting images
   - Registration succeeds
   - Profile cards show images

---

## 📋 Postman Collection (Import This!)

Save this as `cloudinary-test.postman_collection.json`:

```json
{
  "info": {
    "name": "CampusConnect Image Upload",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Test Upload Route",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/upload/test"
      }
    },
    {
      "name": "Upload Image",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/upload",
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "image",
              "type": "file",
              "src": ""
            }
          ]
        }
      }
    },
    {
      "name": "Register Student with Image",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/student/register",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test Student\",\n  \"email\": \"test@example.com\",\n  \"password\": \"Test@123\",\n  \"phone\": \"9876543210\",\n  \"department\": \"Computer Science\",\n  \"year\": 3,\n  \"image\": \"PASTE_CLOUDINARY_URL_HERE\"\n}"
        }
      }
    }
  ]
}
```

---

## 🎊 You're All Set!

After restarting the backend with the new .env file:

✅ Image upload endpoint is public (no login required)
✅ Cloudinary is properly configured
✅ Frontend can upload images during registration
✅ Images display on student/alumni cards

---

## 🔗 Quick Links

- **Cloudinary Dashboard:** https://cloudinary.com/console
- **Backend URL:** http://localhost:5000
- **Frontend URL:** http://localhost:5173
- **Upload Endpoint:** http://localhost:5000/api/upload
- **Test Endpoint:** http://localhost:5000/api/upload/test

---

## 📸 Image Specifications

- **Max Size:** 5 MB
- **Formats:** JPG, JPEG, PNG, GIF, WEBP
- **Auto Resize:** 500x500 pixels (maintains aspect ratio)
- **Storage:** Cloudinary cloud (unlimited)
- **Folder:** campus-connect/

---

## 🎯 Next Step

**RESTART YOUR BACKEND NOW!**

```bash
# In your backend terminal:
Ctrl + C (to stop)
npm run dev (to restart)

# Wait for:
✓ Cloudinary configured
🚀 CampusConnect Backend Server Started
```

Then test in Postman! 🚀
