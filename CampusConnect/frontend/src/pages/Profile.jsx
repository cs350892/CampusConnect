import React from 'react';
import { useParams } from 'react-router-dom';
import { students } from '../data/students';
import { Link } from 'react-router-dom';

function Profile() {
  const { id } = useParams();
  const student = students.find((s) => s.id === parseInt(id));

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Student Not Found</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <img
            src={student.image}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover mr-4"
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