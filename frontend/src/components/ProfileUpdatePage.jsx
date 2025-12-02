import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * OTP PROFILE UPDATE - PAGE 3
 * Profile update form page
 */

function ProfileUpdatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    headline: '',
    techStack: '',
    github: '',
    linkedin: '',
    resumeLink: '',
    branch: '',
    batch: '',
    // Student specific
    dsaProblems: '',
    isPlaced: false,
    // Alumni specific
    company: ''
  });

  const identifier = localStorage.getItem('otp_identifier');
  const type = localStorage.getItem('otp_type');
  const sessionToken = localStorage.getItem('otp_session_token');

  useEffect(() => {
    // Redirect if no session token
    if (!identifier || !type || !sessionToken) {
      navigate('/otp/send');
    }
  }, [identifier, type, sessionToken, navigate]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for API
      const updateData = {
        identifier,
        type,
        sessionToken,
        ...formData
      };

      // Convert techStack string to array
      if (formData.techStack) {
        updateData.techStack = formData.techStack.split(',').map(s => s.trim());
      }

      // Convert dsaProblems to number
      if (formData.dsaProblems) {
        updateData.dsaProblems = parseInt(formData.dsaProblems);
      }

      // Prepare socialLinks object
      if (formData.github || formData.linkedin) {
        updateData.socialLinks = {};
        if (formData.github) updateData.socialLinks.github = formData.github;
        if (formData.linkedin) updateData.socialLinks.linkedin = formData.linkedin;
      }

      // Remove github and linkedin from root level
      delete updateData.github;
      delete updateData.linkedin;

      const response = await axios.post(`${API_URL}/otp/update-profile`, updateData);

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        
        // Clear localStorage
        localStorage.removeItem('otp_identifier');
        localStorage.removeItem('otp_type');
        localStorage.removeItem('otp_session_token');
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
            Update Profile
          </h2>
          <p style={{ color: '#666', fontSize: '15px' }}>
            Update your information below
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          
          {/* Basic Info */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#333', marginBottom: '15px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
              Basic Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="CSE, IT, ECE"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Batch</label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="2024"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Headline</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Full Stack Developer | MERN Stack"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
          </div>

          {/* Technical Details */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#333', marginBottom: '15px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
              Skills & Links
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Skills (comma separated)</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Resume Link</label>
              <input
                type="url"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#333', marginBottom: '15px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
              Additional Details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>DSA Problems Solved</label>
                <input
                  type="number"
                  name="dsaProblems"
                  value={formData.dsaProblems}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Current Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Google, Microsoft, etc"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="isPlaced"
                id="isPlaced"
                checked={formData.isPlaced}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', marginRight: '8px' }}
              />
              <label htmlFor="isPlaced" style={{ fontSize: '14px', color: '#555' }}>
                Currently Placed
              </label>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '20px' }}>
              <p style={{ color: '#c00', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{ padding: '12px', backgroundColor: '#efe', border: '1px solid #cfc', borderRadius: '4px', marginBottom: '20px' }}>
              <p style={{ color: '#080', fontSize: '14px', margin: 0 }}>{success}</p>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
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
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'white',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
