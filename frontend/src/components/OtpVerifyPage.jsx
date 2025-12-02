import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * OTP PROFILE UPDATE - PAGE 2
 * OTP verification page
 */

function OtpVerifyPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds

  const identifier = localStorage.getItem('otp_identifier');
  const type = localStorage.getItem('otp_type');

  useEffect(() => {
    // Redirect if no identifier found
    if (!identifier || !type) {
      navigate('/otp/send');
      return;
    }

    // Countdown timer
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [identifier, type, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/otp/verify`, {
        identifier,
        type,
        otp
      });

      if (response.data.success) {
        // Save session token
        localStorage.setItem('otp_session_token', response.data.sessionToken);
        
        // Navigate to profile update page
        navigate('/otp/update-profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/otp/resend`, {
        identifier,
        type
      });

      if (response.data.success) {
        setTimer(300); // Reset timer
        setOtp('');
        alert('OTP resent successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
            Verify OTP
          </h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
            Enter the 6-digit code sent to
          </p>
          <p style={{ color: '#4F46E5', fontSize: '14px', fontWeight: '500' }}>{identifier}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', textAlign: 'center' }}>
              Enter OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              required
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              autoComplete="off"
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '24px',
                textAlign: 'center',
                letterSpacing: '8px',
                fontWeight: '600'
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {timer > 0 ? (
                <>Time remaining: <strong style={{ color: '#4F46E5' }}>{formatTime(timer)}</strong></>
              ) : (
                <span style={{ color: '#c00', fontWeight: '500' }}>OTP expired</span>
              )}
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '15px' }}>
              <p style={{ color: '#c00', fontSize: '14px', margin: 0, textAlign: 'center' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || timer === 0}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: (loading || timer === 0) ? '#999' : '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: (loading || timer === 0) ? 'not-allowed' : 'pointer',
              marginBottom: '15px'
            }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading || timer > 240}
              style={{
                background: 'none',
                border: 'none',
                color: (resendLoading || timer > 240) ? '#999' : '#4F46E5',
                fontSize: '14px',
                fontWeight: '500',
                cursor: (resendLoading || timer > 240) ? 'not-allowed' : 'pointer',
                textDecoration: 'underline'
              }}
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
            {timer > 240 && (
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Available in {formatTime(timer - 240)}
              </p>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/otp/send')}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ← Change email/phone
            </button>
          </div>

          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#fffbea', borderLeft: '3px solid #fbbf24', borderRadius: '4px' }}>
            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
              <strong>Tip:</strong> Check spam folder if you haven't received the OTP.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpVerifyPage;
