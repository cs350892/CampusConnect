import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * OTP PROFILE UPDATE - PAGE 1
 * Email/Phone input page
 */

function OtpSendPage() {
  const navigate = useNavigate();
  
  // Check if coming from profile page with pre-filled email
  const storedIdentifier = localStorage.getItem('otp_identifier') || '';
  const storedType = localStorage.getItem('otp_identifier_type') || 'email';
  
  const [formData, setFormData] = useState({
    identifier: storedIdentifier,
    type: storedType // 'email' or 'phone'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/otp/send`, formData);
      
      if (response.data.success) {
        setSuccess(response.data.message);
        
        // Save identifier and type to localStorage for next step
        localStorage.setItem('otp_identifier', formData.identifier);
        localStorage.setItem('otp_type', formData.type);
        
        // Navigate to verify OTP page after 1.5 seconds
        setTimeout(() => {
          navigate('/otp/verify');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
            Update Profile
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Enter your email to receive OTP
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: '#555' }}>
              Verification Method
            </label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="email"
                  checked={formData.type === 'email'}
                  onChange={handleChange}
                  style={{ marginRight: '6px' }}
                />
                <span style={{ fontSize: '14px' }}>Email</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="phone"
                  checked={formData.type === 'phone'}
                  onChange={handleChange}
                  style={{ marginRight: '6px' }}
                />
                <span style={{ fontSize: '14px' }}>Phone</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>
              {formData.type === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              name="identifier"
              type={formData.type === 'email' ? 'email' : 'tel'}
              required
              placeholder={formData.type === 'email' ? 'Enter your email' : 'Enter your phone'}
              value={formData.identifier}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            />
          </div>

          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '15px' }}>
              <p style={{ color: '#c00', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{ padding: '12px', backgroundColor: '#efe', border: '1px solid #cfc', borderRadius: '4px', marginBottom: '15px' }}>
              <p style={{ color: '#080', fontSize: '14px', margin: 0 }}>{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#999' : '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>

          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f0f7ff', borderLeft: '3px solid #4F46E5', borderRadius: '4px' }}>
            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
              <strong>Note:</strong> OTP is valid for 5 minutes. Check spam folder if using email.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpSendPage;
