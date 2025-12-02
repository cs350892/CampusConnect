import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Alumni from './pages/Alumni';
import Jobs from './pages/Jobs';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import OtpSendPage from './components/OtpSendPage';
import OtpVerifyPage from './components/OtpVerifyPage';
import ProfileUpdatePage from './components/ProfileUpdatePage';
import UpdateProfileStart from './pages/UpdateProfileStart';
import VerifyOtp from './pages/VerifyOtp';
import UpdateProfileForm from './pages/UpdateProfileForm';
import UpdateProfileByRoll from './pages/UpdateProfileByRoll';
import UpdateProfileByRollForm from './pages/UpdateProfileByRollForm';
import VerifyOTPForUpdate from './pages/VerifyOTPForUpdate';
import AdminDashboard from './pages/AdminDashboard';
import SimpleAdminLogin from './pages/SimpleAdminLogin';
import SimpleAdminDashboard from './pages/SimpleAdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Home />} /> {/* Matches Navbar link */}
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<SimpleAdminLogin />} />
          <Route path="/admin/simple-dashboard" element={<SimpleAdminDashboard />} />
          
          {/* OTP Flow Routes (Old - keep for compatibility) */}
          <Route path="/otp/send" element={<OtpSendPage />} />
          <Route path="/otp/verify" element={<OtpVerifyPage />} />
          <Route path="/otp/update-profile" element={<ProfileUpdatePage />} />
          
          {/* Update Profile Routes (New OTP-based system) */}
          <Route path="/update-profile/start" element={<UpdateProfileStart />} />
          <Route path="/update-profile/verify-otp" element={<VerifyOtp />} />
          <Route path="/update-profile/form" element={<UpdateProfileForm />} />
          
          {/* Update Profile Routes (Email + Roll Number + OTP based system) */}
          <Route path="/update-profile-by-roll" element={<UpdateProfileByRoll />} />
          <Route path="/update-profile-by-roll/verify-otp" element={<VerifyOTPForUpdate />} />
          <Route path="/update-profile-by-roll/form" element={<UpdateProfileByRollForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;