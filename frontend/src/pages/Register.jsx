import React, { useState } from 'react';
import { Users, GraduationCap } from 'lucide-react';
import StudentRegistration from '../components/StudentRegistration';
import AlumniRegistration from '../components/AlumniRegistration';

function Register() {
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAlumniModal, setShowAlumniModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Register with CampusConnect
          </h1>
          <p className="text-lg text-gray-600">
            Choose your registration type to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Registration Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-6 rounded-full mb-4">
                <Users className="w-16 h-16 text-blue-900" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                Student Registration
              </h2>
              <p className="text-gray-600 mb-6">
                Register as a current student to showcase your skills, projects, and connect with alumni
              </p>
              <ul className="text-left text-gray-600 mb-6 space-y-2">
                <li>✓ Create your profile</li>
                <li>✓ Upload your photo</li>
                <li>✓ Showcase your skills & tech stack</li>
                <li>✓ Connect with alumni</li>
                <li>✓ Get referral opportunities</li>
              </ul>
              <button
                onClick={() => setShowStudentModal(true)}
                className="w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium"
              >
                Register as Student
              </button>
            </div>
          </div>

          {/* Alumni Registration Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-6 rounded-full mb-4">
                <GraduationCap className="w-16 h-16 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-orange-600 mb-3">
                Alumni Registration
              </h2>
              <p className="text-gray-600 mb-6">
                Register as an alumnus to mentor students, share opportunities, and stay connected
              </p>
              <ul className="text-left text-gray-600 mb-6 space-y-2">
                <li>✓ Create your professional profile</li>
                <li>✓ Upload your photo</li>
                <li>✓ Share your career journey</li>
                <li>✓ Mentor current students</li>
                <li>✓ Post job opportunities</li>
              </ul>
              <button
                onClick={() => setShowAlumniModal(true)}
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors font-medium"
              >
                Register as Alumni
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Already registered? Check your profile or browse{' '}
            <a href="/" className="text-blue-900 hover:underline">Students</a>
            {' '}or{' '}
            <a href="/alumni" className="text-orange-600 hover:underline">Alumni</a>
          </p>
        </div>
      </div>

      {/* Modals */}
      {showStudentModal && (
        <StudentRegistration onClose={() => setShowStudentModal(false)} />
      )}
      {showAlumniModal && (
        <AlumniRegistration onClose={() => setShowAlumniModal(false)} />
      )}
    </div>
  );
}

export default Register;
