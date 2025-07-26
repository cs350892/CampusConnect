

import React, { useState } from 'react';
import { AlumniRegistration } from '../components/AlumniRegistration';
import { StudentRegistration } from '../components/StudentRegistration';
import { alumni } from '../data/alumni';
import { Users } from 'lucide-react';

export function Alumni() {
  const [isAlumniRegistrationOpen, setIsAlumniRegistrationOpen] = useState(false);
  const [isStudentRegistrationOpen, setIsStudentRegistrationOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">HBTU Alumni</h1>
        <p className="text-gray-600 mb-4">Connect with our successful graduates.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setIsAlumniRegistrationOpen(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
          >
            Alumni Registration
          </button>
          <button
            onClick={() => setIsStudentRegistrationOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Student Registration
          </button>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {alumni.length > 0 ? (
          alumni.map((alumnus) => (
            <div key={alumnus.id} className="bg-white rounded-lg shadow p-4">
              <img
                src={alumnus.image}
                alt={alumnus.name}
                className="w-12 h-12 rounded-full object-cover mb-2"
              />
              <h3 className="text-lg font-semibold text-gray-800">{alumnus.name}</h3>
              <p className="text-gray-600 text-sm">{alumnus.company} ({alumnus.batch})</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {alumnus.techStack.slice(0, 3).map((tech, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href={alumnus.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block text-sm"
              >
                LinkedIn
              </a>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-4">
            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No alumni found.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AlumniRegistration
        isOpen={isAlumniRegistrationOpen}
        onClose={() => setIsAlumniRegistrationOpen(false)}
        onSuccess={() => console.log('Alumni registration completed!')}
      />
      <StudentRegistration
        isOpen={isStudentRegistrationOpen}
        onClose={() => setIsStudentRegistrationOpen(false)}
        onSuccess={() => console.log('Student registration completed!')}
      />
    </div>
  );
}