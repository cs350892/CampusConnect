# 🎓 CampusConnect Backend

Complete MERN stack backend for Alumni-Student Portal with Job Posting, Referral System, and Admin Control.

## 📋 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student, Alumni, Admin)
- Password hashing with bcrypt
- Token-based sessions

### 👨‍🎓 Student Features
- Registration and profile management
- Browse alumni and jobs
- Request referrals from alumni
- Track placement status
- DSA problem tracking

### 🎓 Alumni Features
- Registration (requires admin approval)
- Post job opportunities
- Respond to referral requests
- Manage posted jobs
- Email notifications

### 💼 Job Management
- Alumni can post jobs (after verification)
- Admin approval workflow
- Auto-expiry based on date
- Search and filter functionality
- Status tracking (pending/approved/rejected/expired)

### 🤝 Referral System
- Students request referrals for jobs
- Alumni accept/reject requests
- Email notifications for both parties
- One request per student per job
- Withdraw functionality

### 👨‍💼 Admin Panel
- Approve/reject alumni applications
- Approve/reject job postings
- Bulk operations support
- Activity logging for audit trails
- Dashboard with statistics
- View all referrals

### 📧 Email Notifications
- Alumni approval/rejection
- Job approval/rejection
- Referral request notifications
- Referral response notifications

### 📊 Activity Logs
- Track all admin actions
- Audit trail for compliance
- Filter by user/action/date

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB with Mongoose v8.16.5
- **Authentication:** JWT (jsonwebtoken v9.0.2)
- **Password:** bcryptjs v2.4.3
- **Email:** Nodemailer v6.9.7
- **Validation:** express-validator v7.2.1
- **Others:** CORS, dotenv

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js       # Registration, Login, Profile
│   │   ├── studentController.js    # Student CRUD
│   │   ├── alumniController.js     # Alumni CRUD
│   │   ├── jobController.js        # Job management
│   │   ├── referralController.js   # Referral system
│   │   └── adminController.js      # Admin operations
│   ├── models/
│   │   ├── User.js                 # Unified user model
│   │   ├── Job.js                  # Job postings
│   │   ├── Referral.js             # Referral requests
│   │   └── ActivityLog.js          # Admin activity logs
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── alumniRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── referralRoutes.js
│   │   └── adminRoutes.js
│   ├── middlewares/
│   │   ├── auth.js                 # JWT auth & role checks
│   │   └── validator.js            # Input validation
│   ├── utils/
│   │   └── sendEmail.js            # Email service
│   ├── data/                       # Seed data
│   ├── seed.js                     # Database seeding
│   └── index.js                    # Main server file
├── .env.example                     # Environment variables template
├── package.json
├── API_DOCUMENTATION.md             # Complete API docs
└── test-complete-apis.js            # Automated tests
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended, v18+ for testing)
- MongoDB (local or Atlas)
- Gmail account (for email notifications)

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/campus-connect

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=CampusConnect <noreply@campusconnect.com>

# Admin
ADMIN_EMAIL=admin@campusconnect.com
ADMIN_PASSWORD=Admin@123
```

4. **Gmail App Password Setup:**
   - Go to Google Account Settings
   - Enable 2-Factor Authentication
   - Generate App Password for "Mail"
   - Use that password in `EMAIL_PASS`

5. **Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

6. **Start the server:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📝 Database Seeding

To populate the database with sample data:

```bash
node src/seed.js
```

## 🧪 Testing

### Automated Tests
```bash
node test-complete-apis.js
```

### Manual Testing with REST Client
1. Install REST Client extension in VS Code
2. Open `test-api.rest`
3. Click "Send Request" on any endpoint

### Health Check
```bash
curl http://localhost:5000/api/health
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register student/alumni
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get single student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Alumni
- `GET /api/alumni` - Get all alumni
- `GET /api/alumni/:id` - Get single alumni
- `PUT /api/alumni/:id` - Update alumni
- `DELETE /api/alumni/:id` - Delete alumni

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (verified alumni)
- `GET /api/jobs/my-jobs` - Get my jobs (alumni)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `PUT /api/jobs/:id/approve` - Approve job (admin)
- `PUT /api/jobs/:id/reject` - Reject job (admin)
- `GET /api/jobs/stats` - Get job statistics

### Referrals
- `GET /api/referrals` - Get all referrals
- `GET /api/referrals/:id` - Get single referral
- `POST /api/referrals` - Create referral request (student)
- `PUT /api/referrals/:id/respond` - Respond to referral (alumni)
- `DELETE /api/referrals/:id` - Withdraw referral (student)
- `GET /api/referrals/stats` - Get referral statistics

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/alumni/pending` - Get pending alumni
- `PUT /api/admin/alumni/:id/approve` - Approve alumni
- `PUT /api/admin/alumni/:id/reject` - Reject alumni
- `POST /api/admin/alumni/bulk-approve` - Bulk approve
- `GET /api/admin/jobs` - Get all jobs (admin view)
- `GET /api/admin/jobs/pending` - Get pending jobs
- `DELETE /api/admin/jobs/:id` - Delete job
- `GET /api/admin/referrals` - View all referrals
- `GET /api/admin/activity-logs` - Get activity logs

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed documentation.

## 🔐 User Roles & Permissions

### Student
✅ Register/Login  
✅ View alumni and jobs  
✅ Update own profile  
✅ Request referrals  
✅ View own referrals  

### Alumni (Unverified)
✅ Register/Login  
✅ View limited features  
❌ Cannot post jobs  
❌ Cannot respond to referrals  

### Alumni (Verified)
✅ All unverified permissions  
✅ Post jobs  
✅ Respond to referrals  
✅ Manage posted jobs  

### Admin
✅ All alumni permissions  
✅ Approve/reject alumni  
✅ Approve/reject jobs  
✅ View all data  
✅ Access activity logs  
✅ Bulk operations  

## 📧 Email Templates

The system sends automatic emails for:
1. **Alumni Approval** - Welcome message with instructions
2. **Alumni Rejection** - Rejection with reason
3. **Job Approval** - Confirmation of job posting
4. **Job Rejection** - Rejection with reason
5. **Referral Request** - Notification to alumni
6. **Referral Response** - Notification to student

## 🛡️ Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Role-based access control
- Input validation with express-validator
- Protected routes with middleware
- CORS configuration
- Environment variable management
- Activity logging for audit trails

## 📊 Data Models

### User Model
- Unified model for students, alumni, and admins
- Role-based fields
- Password hashing middleware
- Public profile method
- Verification status

### Job Model
- Posted by verified alumni
- Requires admin approval
- Auto-expiry functionality
- Status tracking
- Referral count

### Referral Model
- Student-to-alumni requests
- One request per job per student
- Status: pending/accepted/rejected/withdrawn
- Email notifications

### ActivityLog Model
- Tracks all admin actions
- Audit trail
- Filter capabilities

## 🐛 Common Issues & Solutions

### Issue: Email not sending
**Solution:** 
- Check Gmail App Password is correct
- Ensure 2FA is enabled on Gmail
- Verify EMAIL_USER and EMAIL_PASS in .env

### Issue: MongoDB connection failed
**Solution:**
- Check MongoDB is running: `mongod`
- Verify MONGO_URI in .env
- Check MongoDB port (default: 27017)

### Issue: JWT token expired
**Solution:**
- Login again to get new token
- Adjust JWT_EXPIRE in .env (default: 30d)

### Issue: Alumni can't post jobs
**Solution:**
- Alumni must be verified by admin first
- Check isVerified field in database

## 📈 Future Enhancements

- [ ] File upload for resumes and images
- [ ] Real-time notifications with Socket.io
- [ ] Email verification on registration
- [ ] Forgot password functionality
- [ ] Rate limiting for API requests
- [ ] Pagination improvements
- [ ] Search with fuzzy matching
- [ ] Analytics dashboard
- [ ] Export data to Excel/CSV
- [ ] Integration with LinkedIn API

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for CampusConnect

## 🆘 Support

For issues or questions:
- Check API_DOCUMENTATION.md
- Review common issues above
- Test with test-complete-apis.js
- Check MongoDB and email configuration

---

**Happy Coding! 🚀**
