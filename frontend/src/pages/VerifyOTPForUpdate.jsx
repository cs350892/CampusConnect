import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Hash, Lock, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const VerifyOTPForUpdate = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    // Get stored credentials
    const storedEmail = localStorage.getItem('verifiedEmail');
    const storedRollNumber = localStorage.getItem('verifiedRollNumber');
    
    if (!storedEmail || !storedRollNumber) {
      navigate('/update-profile-by-roll');
      return;
    }
    
    setEmail(storedEmail);
    setRollNumber(storedRollNumber);
  }, [navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await axios.post(
        `${API_URL}/profile-verify/verify-otp`,
        {
          email: email,
          rollNumber: rollNumber,
          otp: otp.trim()
        }
      );

      if (response.data.success && response.data.verified) {
        // Store user data for prefilling form
        localStorage.setItem('verifiedUserData', JSON.stringify(response.data.userData));
        
        // Navigate to update form
        navigate('/update-profile-by-roll/form');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setResendMessage('');
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await axios.post(
        `${API_URL}/profile-verify/send-otp`,
        {
          email: email,
          rollNumber: rollNumber
        }
      );

      if (response.data.success) {
        setResendMessage('OTP resent successfully! Check your email.');
        setOtp('');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/update-profile-by-roll');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verify OTP
          </h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  setError('');
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-2xl font-bold tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please check your email for the OTP
              </p>
            </div>

            {/* Success Message */}
            {resendMessage && (
              <div className="flex items-start space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{resendMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : "Didn't receive OTP? Resend"}
              </button>
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">OTP Valid for 10 Minutes</p>
                <p>The OTP sent to your email is valid for 10 minutes only.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPForUpdate;
