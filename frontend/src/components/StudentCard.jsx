import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Code, Award, Github, Linkedin, ExternalLink } from 'lucide-react';

function StudentCard({ student }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5 border border-gray-100">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={(student.imageUrl || student.image || 'https://i.ibb.co/TqK1XTQm/image-5.jpg') + (student.updatedAt ? `?t=${new Date(student.updatedAt).getTime()}` : '')}
          alt={student.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
          onError={(e) => { e.target.src = 'https://i.ibb.co/TqK1XTQm/image-5.jpg'; }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{student.name}</h3>
          <p className="text-sm text-gray-600 mb-1">{student.branch || 'MCA'}</p>
          <p className="text-xs text-gray-500">Batch: {student.batch}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {student.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{student.location}</span>
          </div>
        )}
        
        {student.rollNumber && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="w-4 h-4 text-gray-400" />
            <span>Roll: {student.rollNumber}</span>
          </div>
        )}

        {student.dsaProblems > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Code className="w-4 h-4 text-gray-400" />
            <span>{student.dsaProblems} DSA Problems</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span className={`text-sm font-medium ${student.isPlaced ? 'text-green-600' : 'text-orange-600'}`}>
            {student.isPlaced ? 'Placed' : 'Seeking Opportunities'}
          </span>
        </div>
      </div>

      {/* Tech Stack */}
      {student.skills?.development?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {student.skills.development.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-100"
              >
                {tech}
              </span>
            ))}
            {student.skills.development.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{student.skills.development.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        {student.socialLinks?.github && (
          <a
            href={student.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
        {student.socialLinks?.linkedin && (
          <a
            href={student.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        <Link
          to={`/profile/${student.id}`}
          className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          View Profile
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default StudentCard;