import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { studentAPI } from '../utils/api';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if current user is viewing their own profile
  const isOwnProfile = () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return false;
    
    // You can decode JWT to get user ID, or store user info separately
    // For now, we'll check if user is logged in
    return authToken && authToken.trim() !== '' && authToken !== 'null';
  };
  
  const handleUpdateProfile = () => {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken || authToken.trim() === '' || authToken === 'null') {
      // Not logged in - show alert and redirect to login/register
      alert('Please login to update your profile');
      navigate('/register'); // or '/login' if you have a separate login page
      return;
    }
    
    // Store student email for OTP flow
    if (student && student.email) {
      localStorage.setItem('otp_identifier', student.email);
      localStorage.setItem('otp_identifier_type', 'email');
      localStorage.setItem('otp_user_id', id);
      navigate('/otp/send');
    } else {
      alert('Email not found. Cannot proceed with profile update.');
    }
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await studentAPI.getById(id);
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading student profile...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Student Not Found</h2>
        <p className="text-red-600 mt-2">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Student ID Card / Profile */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        {/* Update Profile Button - Show only if user is logged in */}
        {isOwnProfile() && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Update Profile
            </button>
          </div>
        )}
        
        <div className="flex items-center mb-4">
          <img
            src={student.imageUrl || student.image || 'https://i.ibb.co/TqK1XTQm/image-5.jpg'}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover mr-4 border-4 border-blue-100"
            onError={(e) => { e.target.src = 'https://i.ibb.co/TqK1XTQm/image-5.jpg'; }}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-600">{student.headline}</p>
            <p className="text-gray-500 text-sm">{student.pronouns}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-2">{student.branch} ({student.batch})</p>
        <p className="text-gray-600 mb-4">{student.isPlaced ? 'Placed' : 'Unplaced'}</p>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {student.skills.dsa.map((skill, index) => (
              <span key={`dsa-${index}`} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {student.skills.development.map((skill, index) => (
              <span key={`dev-${index}`} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <a
            href={student.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>
          <a
            href={student.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default Profile;