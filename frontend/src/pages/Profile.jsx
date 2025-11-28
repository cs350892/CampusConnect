import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentAPI } from '../utils/api';

function Profile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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