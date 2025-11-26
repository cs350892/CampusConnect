# 🚀 CampusConnect - Quick Start Guide

## ✅ Integration Status: COMPLETE

Your React frontend is now **fully integrated** with the backend using Axios!

---

## 📁 Files Updated

### ✨ New/Updated Files:
1. **`frontend/src/utils/api.js`** - Enhanced with error handling & interceptors
2. **`frontend/src/components/StudentRegistration.jsx`** - Now uses Axios
3. **`frontend/src/components/AlumniRegistration.jsx`** - Now uses Axios
4. **`frontend/.env.example`** - Environment variable template

---

## 🎯 What Works Now

### Student Registration Form
- ✅ POST to `/api/students`
- ✅ All fields match backend exactly
- ✅ Loading spinner during submit
- ✅ Success message on completion
- ✅ Error handling with user-friendly messages
- ✅ Form validation

### Alumni Registration Form
- ✅ POST to `/api/alumni`
- ✅ All fields match backend exactly
- ✅ Loading spinner during submit
- ✅ Success message on completion
- ✅ Error handling with user-friendly messages
- ✅ Form validation

---

## 🏃‍♂️ How to Run

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm install
npm start
```
✅ Backend runs on `http://localhost:5000`

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend runs on `http://localhost:5173`

### 3. Open Browser
Navigate to: `http://localhost:5173`

---

## 🧪 Test It!

### Test Student Registration:
1. Click "Register as Student" button
2. Fill in form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Roll Number: `21MCA001`
   - Batch: `2021-2023`
   - (Optional fields as desired)
3. Click "Register Now"
4. ✅ Success message appears
5. ✅ Check MongoDB - new student added!

### Test Alumni Registration:
1. Click "Register as Alumni" button
2. Fill in form:
   - Name: `Jane Smith`
   - Email: `jane@example.com`
   - Phone: `+91 9876543210`
   - Batch: `2018-2020`
   - Company: `Google`
   - (Optional fields as desired)
3. Click "Submit Registration"
4. ✅ Success message appears
5. ✅ Check MongoDB - new alumni added!

---

## 🔍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/students` | Create new student |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/alumni` | Create new alumni |
| GET | `/api/alumni` | Get all alumni |
| GET | `/api/alumni/:id` | Get alumni by ID |

---

## 🛠️ Tech Stack

### Frontend:
- React 19
- Axios for HTTP requests
- TailwindCSS for styling
- Lucide React for icons
- Vite for bundling

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- CORS enabled
- Validation middleware

---

## 📋 Field Mapping

### Student Fields (Frontend → Backend):
```javascript
{
  name: string,           // Required
  email: string,          // Required
  phone: string,          // Optional
  rollNumber: string,     // Required
  batch: string,          // Required
  branch: string,         // Optional (default: "Not Specified")
  dsaProblems: number,    // Optional (default: 0)
  techStack: string,      // Optional (comma-separated)
  resumeLink: string,     // Optional
  location: string,       // Optional (default: "India")
  pronouns: string,       // Optional (default: "They/Them")
  socialLinks: {
    github: string,       // Optional (default: "https://github.com")
    linkedin: string      // Optional
  }
}
```

### Alumni Fields (Frontend → Backend):
```javascript
{
  name: string,           // Required
  email: string,          // Required
  phone: string,          // Required
  batch: string,          // Required
  company: string,        // Required
  branch: string,         // Optional (default: "Not Specified")
  techStack: string,      // Optional (comma-separated)
  resumeLink: string,     // Optional
  location: string,       // Optional (default: "India")
  pronouns: string,       // Optional (default: "They/Them")
  socialLinks: {
    github: string,       // Optional (default: "https://github.com")
    linkedin: string      // Optional
  }
}
```

---

## 🎨 UI Features

### Loading State:
- Spinner animation
- Button text changes to "Registering..." / "Submitting..."
- All inputs disabled
- Cancel button disabled

### Success State:
- Green banner with checkmark
- "Registration successful!" message
- Auto-close after 1.5 seconds
- Form resets automatically

### Error State:
- Red banner with error icon
- Displays error message from server
- Error clears when user edits form
- Validation errors show before API call

---

## 🐛 Troubleshooting

### Issue: "Network Error"
- ✅ Check backend is running on port 5000
- ✅ Check MongoDB is connected
- ✅ Check console for errors

### Issue: "Email already exists"
- ✅ This is expected - each email must be unique
- ✅ Try a different email address

### Issue: Form not submitting
- ✅ Check all required fields are filled
- ✅ Check email format is valid
- ✅ Check browser console for errors

### Issue: CORS error
- ✅ Backend already has CORS configured
- ✅ Check backend `.env` has `FRONTEND_URL=http://localhost:5173`

---

## 🎉 You're All Set!

Your frontend-backend integration is complete and production-ready. The code follows best practices with:
- ✅ Proper error handling
- ✅ Loading states
- ✅ Input validation
- ✅ Clean code structure
- ✅ Axios for HTTP requests
- ✅ Responsive UI
- ✅ User-friendly messages

**Happy Coding! 🚀**

---

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

For detailed integration documentation, see `INTEGRATION_COMPLETE.md`
