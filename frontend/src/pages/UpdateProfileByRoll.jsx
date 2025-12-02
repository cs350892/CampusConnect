import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Hash, Lock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const UpdateProfileByRoll = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    rollNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Step 1: Send OTP to email
      const response = await axios.post(
        `${API_URL}/profile-verify/send-otp`,
        {
          email: formData.email.trim(),
          rollNumber: formData.rollNumber.trim()
        }
      );

      if (response.data.success) {
        // Store credentials for OTP verification
        localStorage.setItem('verifiedEmail', formData.email.trim());
        localStorage.setItem('verifiedRollNumber', formData.rollNumber.trim());
        
        // Navigate to OTP verification page
        navigate('/update-profile-by-roll/verify-otp');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Update Your Profile
          </h1>
          <p className="text-gray-600">
            Verify your identity with email and roll number
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Roll Number Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Roll Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 12345678"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Simple Verification</p>
                <p>Enter your registered email and roll number to access your profile.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your information is secure and will only be used for verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileByRoll;
