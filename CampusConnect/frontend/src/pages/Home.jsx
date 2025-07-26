import React, { useState } from 'react';
import StudentCard from '../components/StudentCard';
import FilterBar from '../components/FilterBar';
import AlumniRegistration from '../components/AlumniRegistration';
import StudentRegistration from '../components/StudentRegistration';
import { students } from '../data/students';
import { Users } from 'lucide-react';

function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAlumniRegistrationOpen, setIsAlumniRegistrationOpen] = useState(false);
  const [isStudentRegistrationOpen, setIsStudentRegistrationOpen] = useState(false);

  const filteredStudents = students.filter((student) => {
    if (activeFilter === 'Placed') return student.isPlaced;
    if (activeFilter === 'Unplaced') return !student.isPlaced;
    return true;
  });

  const placedCount = students.filter((student) => student.isPlaced).length;
  const totalCount = students.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Welcome to HBTU Connect</h1>
        <p className="text-gray-600 mb-4">Connect with MCA students and alumni.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setIsStudentRegistrationOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Student Registration
          </button>
          <button
            onClick={() => setIsAlumniRegistrationOpen(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
          >
            Alumni Registration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800">{placedCount}</h3>
          <p className="text-gray-600 text-sm">Placed Students</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800">{totalCount}</h3>
          <p className="text-gray-600 text-sm">Total Students</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Students</h2>
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))
          ) : (
            <div className="col-span-full text-center py-4">
              <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No students found.</p>
            </div>
          )}
        </div>
      </div>

      <AlumniRegistration
        isOpen={isAlumniRegistrationOpen}
        onClose={() => setIsAlumniRegistrationOpen(false)}
        onSuccess={() => console.log('Alumni registration submitted!')}
      />
      <StudentRegistration
        isOpen={isStudentRegistrationOpen}
        onClose={() => setIsStudentRegistrationOpen(false)}
        onSuccess={() => console.log('Student registration submitted!')}
      />
    </div>
  );
}

export default Home;