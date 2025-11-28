# 📮 Postman Testing - Step by Step with Screenshots Guide

## 🎯 Before You Start

### ✅ Make Sure:
1. Backend is running: `npm run dev` in backend folder
2. You see: `✓ Cloudinary configured` in terminal
3. Postman is installed (Download from postman.com if needed)

---

## 📋 Test 1: Check Configuration

### Step 1: Create New Request in Postman

1. Open Postman
2. Click "+" to create new request
3. Set request name: "Test Cloudinary Config"

### Step 2: Configure Request

```
Method: GET
URL: http://localhost:5000/api/upload/test
```

### Step 3: Send Request

Click the blue "Send" button

### Step 4: Verify Response

You should see:
```json
{
  "success": true,
  "message": "Upload route is accessible!",
  "cloudinaryConfigured": true
}
```

**✅ If `cloudinaryConfigured` is `true` → Proceed to Test 2**
**❌ If `false` → Restart your backend server**

---

## 📸 Test 2: Upload Image

### Step 1: Create New Request

1. Click "+" for new request
2. Name it: "Upload Image to Cloudinary"

### Step 2: Set Method and URL

```
Method: POST
URL: http://localhost:5000/api/upload
```

### Step 3: Configure Body (CRITICAL!)

**THIS IS THE MOST IMPORTANT PART:**

1. Click on the **"Body"** tab (below the URL bar)
2. Select **"form-data"** radio button
   - ⚠️ NOT "raw"
   - ⚠️ NOT "x-www-form-urlencoded"
   - ⚠️ NOT "binary"
   - ✅ MUST BE "form-data"

### Step 4: Add Image Field

1. In the KEY column, type: `image` (lowercase, no quotes)
2. In the KEY row, you'll see a dropdown on the right side
3. Click the dropdown and change from "Text" to **"File"**
4. In the VALUE column, click "Select Files"
5. Choose any image file from your computer (JPG, PNG, etc.)

**Your form-data should look like:**
```
KEY         TYPE    VALUE
image       File    [myPhoto.jpg] ← File name shows here
```

### Step 5: Send Request

Click the blue "Send" button

### Step 6: Verify Response

You should see:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "url": "https://res.cloudinary.com/dnwhfrhah/image/upload/v1732665432/campus-connect/xyz123.jpg",
  "public_id": "campus-connect/xyz123"
}
```

### Step 7: Copy the URL

**IMPORTANT:** Copy the entire `url` value. You'll need it for the next test!

Example:
```
https://res.cloudinary.com/dnwhfrhah/image/upload/v1732665432/campus-connect/xyz123.jpg
```

### Step 8: Test URL in Browser (Optional)

Paste the URL in your browser's address bar. You should see your uploaded image!

---

## 👨‍🎓 Test 3: Register Student with Image

### Step 1: Create New Request

1. Click "+" for new request
2. Name it: "Register Student with Image"

### Step 2: Set Method and URL

```
Method: POST
URL: http://localhost:5000/api/students
```

### Step 3: Configure Headers

1. Click on the **"Headers"** tab
2. Add header:
   - Key: `Content-Type`
   - Value: `application/json`

(Postman may auto-add this when you select "raw" and "JSON" in Body)

### Step 4: Configure Body

1. Click on the **"Body"** tab
2. Select **"raw"** radio button (not form-data this time!)
3. From the dropdown on the right (shows "Text"), select **"JSON"**

### Step 5: Paste JSON Body

```json
{
  "name": "Test Student",
  "email": "teststudent@example.com",
  "rollNumber": "2024001",
  "batch": "2024",
  "branch": "Computer Science",
  "phone": "9876543210",
  "techStack": "React, Node.js, MongoDB",
  "image": "PASTE_YOUR_CLOUDINARY_URL_HERE"
}
```

**⚠️ IMPORTANT:** Replace `PASTE_YOUR_CLOUDINARY_URL_HERE` with the URL you copied from Test 2!

Example:
```json
{
  "name": "Test Student",
  "email": "teststudent@example.com",
  "rollNumber": "2024001",
  "batch": "2024",
  "branch": "Computer Science",
  "phone": "9876543210",
  "techStack": "React, Node.js, MongoDB",
  "image": "https://res.cloudinary.com/dnwhfrhah/image/upload/v1732665432/campus-connect/xyz123.jpg"
}
```

### Step 6: Send Request

Click "Send"

### Step 7: Verify Response

You should see:
```json
{
  "message": "Student registered successfully",
  "student": {
    "id": 1,
    "name": "Test Student",
    "email": "teststudent@example.com",
    "rollNumber": "2024001",
    "batch": "2024",
    "branch": "Computer Science",
    "image": "https://res.cloudinary.com/dnwhfrhah/image/upload/...",
    ...
  }
}
```

**✅ SUCCESS!** Your student is registered with a profile image!

---

## 👨‍💼 Test 4: Register Alumni with Image

### Step 1: Create New Request

Name it: "Register Alumni with Image"

### Step 2: Set Method and URL

```
Method: POST
URL: http://localhost:5000/api/alumni
```

### Step 3: Configure Body

1. Body → raw → JSON
2. Paste:

```json
{
  "name": "Test Alumni",
  "email": "testalumni@example.com",
  "phone": "9876543211",
  "batch": "2020",
  "company": "Google",
  "branch": "Computer Science",
  "techStack": "JavaScript,React,Node.js",
  "image": "PASTE_YOUR_CLOUDINARY_URL_HERE"
}
```

**Note:** Use a different email than the student!

### Step 4: Send Request

Click "Send"

### Step 5: Verify Response

```json
{
  "message": "Alumni registered successfully",
  "alumni": {
    "id": 1,
    "name": "Test Alumni",
    "email": "testalumni@example.com",
    "company": "Google",
    "image": "https://res.cloudinary.com/...",
    ...
  }
}
```

---

## ✅ Test 5: View Registered Users

### Get All Students

```
Method: GET
URL: http://localhost:5000/api/students
```

Response shows all students with their images!

### Get All Alumni

```
Method: GET
URL: http://localhost:5000/api/alumni
```

Response shows all alumni with their images!

---

## 🐛 Common Errors & Solutions

### Error: "No file uploaded"

**Cause:** File not properly attached in Postman

**Solution:**
1. Make sure you're on the "Body" tab
2. Select "form-data" (not raw!)
3. Key must be exactly `image` (lowercase)
4. Type must be "File" (not "Text")
5. A file must be selected

**Visual Check:**
```
✅ Correct:
Body → form-data
KEY: image | TYPE: File | VALUE: [filename.jpg]

❌ Wrong:
Body → raw
Body → form-data with Type: Text
```

---

### Error: "Image upload service not configured"

**Cause:** Cloudinary credentials not loaded

**Solution:**
1. Make sure backend `.env` has Cloudinary credentials
2. Restart backend: Ctrl+C then `npm run dev`
3. Wait for "✓ Cloudinary configured" in logs

---

### Error: "Cannot POST /api/upload"

**Cause:** Backend not running or wrong URL

**Solution:**
1. Check backend is running: `npm run dev`
2. Verify URL is exactly: `http://localhost:5000/api/upload`
3. Check port 5000 is not blocked

---

### Error: "Only image files are allowed"

**Cause:** Trying to upload non-image file

**Solution:**
- Upload only: .jpg, .jpeg, .png, .gif, .webp
- Not: .pdf, .txt, .doc, .zip

---

### Error: "File too large"

**Cause:** Image file is over 5MB

**Solution:**
- Use image smaller than 5MB
- Compress image online (tinypng.com)
- Choose smaller resolution image

---

## 📊 Summary Table

| Test | Method | URL | Body Type | Key Field | Success Indicator |
|------|--------|-----|-----------|-----------|-------------------|
| 1. Config Check | GET | /api/upload/test | None | - | `cloudinaryConfigured: true` |
| 2. Upload Image | POST | /api/upload | form-data | image (File) | Returns `url` |
| 3. Register Student | POST | /api/students | raw JSON | - | Returns student with `image` |
| 4. Register Alumni | POST | /api/alumni | raw JSON | - | Returns alumni with `image` |
| 5. View Students | GET | /api/students | None | - | Array with images |
| 6. View Alumni | GET | /api/alumni | None | - | Array with images |

---

## 🎯 Quick Checklist

Before testing:
- [ ] Backend running (`npm run dev`)
- [ ] See "✓ Cloudinary configured" in logs
- [ ] Postman installed and open

During testing:
- [ ] Test 1 passed (config check)
- [ ] Test 2 passed (image upload)
- [ ] Copied Cloudinary URL
- [ ] Test 3 passed (student registration)
- [ ] Test 4 passed (alumni registration)

After testing:
- [ ] All tests passed
- [ ] Images display when viewing users
- [ ] URLs work in browser
- [ ] Ready to test frontend!

---

## 🎊 You're Done!

All tests passed? Your image upload is **fully working**! 🎉

**Next:** Test in your React frontend at http://localhost:5173

---

## 📝 Save Your Tests

**Tip:** In Postman, you can save all these requests in a Collection for future use!

1. Click "Collections" in left sidebar
2. Create new collection: "CampusConnect Tests"
3. Save all your requests there
4. Share with team members if needed

---

**Created:** 2025-11-27
**Status:** ✅ Complete Guide
**Difficulty:** Easy (just follow steps!)
