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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fill in the details you want to update
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white shadow-md rounded-lg p-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  id="branch"
                  placeholder="e.g., CSE, IT, ECE"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.branch}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700">
                  Batch
                </label>
                <input
                  type="text"
                  name="batch"
                  id="batch"
                  placeholder="e.g., 2024"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.batch}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="e.g., Delhi, India"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                Headline
              </label>
              <input
                type="text"
                name="headline"
                id="headline"
                placeholder="e.g., Full Stack Developer | MERN Stack"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.headline}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Technical Details</h3>
            
            <div>
              <label htmlFor="techStack" className="block text-sm font-medium text-gray-700">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                name="techStack"
                id="techStack"
                placeholder="e.g., React, Node.js, MongoDB"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.techStack}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="resumeLink" className="block text-sm font-medium text-gray-700">
                Resume Link
              </label>
              <input
                type="url"
                name="resumeLink"
                id="resumeLink"
                placeholder="https://drive.google.com/your-resume"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.resumeLink}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github"
                  id="github"
                  placeholder="https://github.com/username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.github}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Student/Alumni Specific */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dsaProblems" className="block text-sm font-medium text-gray-700">
                  DSA Problems Solved (Students)
                </label>
                <input
                  type="number"
                  name="dsaProblems"
                  id="dsaProblems"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.dsaProblems}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Current Company (Alumni)
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  placeholder="e.g., Google"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPlaced"
                id="isPlaced"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.isPlaced}
                onChange={handleChange}
              />
              <label htmlFor="isPlaced" className="ml-2 block text-sm text-gray-900">
                I am currently placed (Students)
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
