# 📸 Cloudinary Image Upload - Postman Testing Guide

## ✅ Prerequisites Check

### 1. Verify .env Configuration
Your `.env` file now has (UPDATED):
```env
CLOUDINARY_CLOUD_NAME=dnwhfrhah
CLOUDINARY_API_KEY=815672369367378
CLOUDINARY_API_SECRET=hvM_9TTaLEuEAgcBzgypoxixU5Y
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```
✅ Server should show: `✓ Cloudinary configured`

**IMPORTANT:** If you don't see "✓ Cloudinary configured", press `Ctrl+C` and restart!

---

## 🧪 Postman Test Cases

### Test 1: Health Check (Optional)
**Purpose:** Verify upload route is accessible

```
Method: GET
URL: http://localhost:5000/api/upload/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Upload route is accessible!",
  "cloudinaryConfigured": true
}
```

---

### Test 2: Upload Image (MAIN TEST)

#### Step-by-Step Instructions:

1. **Open Postman** and create a new request

2. **Set Request Type:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/upload`

3. **Configure Body:**
   - Go to **Body** tab
   - Select **form-data** (NOT raw JSON!)
   - Add a new key-value pair:
     - **Key:** `image` (must be exactly this)
     - **Type:** Change from "Text" to **"File"** (dropdown on right)
     - **Value:** Click "Select Files" and choose an image (JPG, PNG, etc.)

4. **Send Request**

#### ✅ Expected Success Response:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "url": "https://res.cloudinary.com/dnwhfrhah/image/upload/v1234567890/campus-connect/abcd1234.jpg",
  "public_id": "campus-connect/abcd1234"
}
```

#### ❌ Possible Error Responses:

**No file uploaded:**
```json
{
  "success": false,
  "message": "No file uploaded"
}
```
**Solution:** Make sure key is `image` and type is "File" not "Text"

**Cloudinary not configured:**
```json
{
  "success": false,
  "message": "Image upload service not configured"
}
```
**Solution:** Check your .env file and restart backend

**File too large:**
```json
{
  "success": false,
  "message": "File too large",
  "error": "File too large"
}
```
**Solution:** Use image smaller than 5MB

---

### Test 3: Upload Multiple Times
Try uploading 2-3 different images to verify consistency.

Each upload should return a UNIQUE `url` and `public_id`.

---

### Test 4: Copy URL and Test in Browser
1. Copy the `url` from response
2. Paste in browser address bar
3. Image should display correctly

Example URL:
```
https://res.cloudinary.com/dnwhfrhah/image/upload/v1234567890/campus-connect/abcd1234.jpg
```

---

## 🔍 Troubleshooting

### Issue: "Cannot POST /api/upload"
**Solution:** 
- Check server is running on port 5000
- Verify URL is exactly: `http://localhost:5000/api/upload`

### Issue: "Network Error" or "ECONNREFUSED"
**Solution:**
- Backend server is not running
- Run `npm start` in backend folder

### Issue: "Invalid credentials"
**Solution:**
- Double-check Cloudinary credentials in .env
- Make sure no extra spaces in .env values
- Restart backend after changing .env

### Issue: "Only image files are allowed"
**Solution:**
- Upload only image files (JPG, PNG, GIF, WEBP)
- Not PDF, TXT, or other file types

---

## 📋 Quick Reference - Postman Settings

```
Method:     POST
URL:        http://localhost:5000/api/upload
Body:       form-data (NOT raw JSON)
Key:        image
Type:       File (dropdown)
Value:      [Select your image file]
Auth:       None (public route)
Headers:    Not needed (auto-set by Postman)
```

---

## 🎯 Expected Flow

1. **Select File** → Postman form-data
2. **Send Request** → Backend receives file
3. **Upload to Cloudinary** → Image stored in cloud
4. **Return URL** → Use in registration

---

## ✅ Success Checklist

- [ ] Backend server running
- [ ] Cloudinary credentials in .env
- [ ] Postman POST request to /api/upload
- [ ] Body type: form-data
- [ ] Key: image, Type: File
- [ ] Image file selected (JPG/PNG)
- [ ] Response returns valid URL
- [ ] URL works in browser
- [ ] Can upload multiple images

---

## 🔗 Next Steps

Once Postman test succeeds, your frontend will work automatically!

The frontend code already does:
1. User selects image
2. Upload to `/api/upload`
3. Get Cloudinary URL
4. Include URL in registration payload

**Note:** If Postman works but frontend doesn't, it's a CORS or frontend code issue, NOT a backend issue.

---

## 📞 Support

If test fails, check:
1. Console logs in backend terminal
2. Cloudinary dashboard (cloudinary.com) - verify credentials
3. .env file - no typos or extra spaces
4. Restart backend after .env changes

---

## 🎉 Test Result

After successful test, you'll have:
- ✅ Working image upload
- ✅ Cloudinary URL
- ✅ Ready for frontend integration

**Save the returned URL** - you can use it to test student/alumni registration!
