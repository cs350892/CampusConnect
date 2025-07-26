import React from 'react';
import { Link } from 'react-router-dom';

function StudentCard({ student }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img
        src={student.image}
        alt={student.name}
        className="w-12 h-12 rounded-full object-cover mb-2"
      />
      <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
      <p className="text-gray-600 text-sm">{student.branch} ({student.batch})</p>
      <p className="text-gray-500 text-sm">{student.isPlaced ? 'Placed' : 'Unplaced'}</p>
      <Link
        to={`/profile/${student.id}`}
        className="text-blue-600 hover:underline mt-2 inline-block text-sm"
      >
        View Profile
      </Link>
    </div>
  );
}

export default StudentCard;