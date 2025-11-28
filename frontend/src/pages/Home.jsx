import React, { useState, useEffect } from 'react';
import StudentCard from '../components/StudentCard';
import FilterBar from '../components/FilterBar';
import AlumniRegistration from '../components/AlumniRegistration';
import StudentRegistration from '../components/StudentRegistration';
import { studentAPI } from '../utils/api';
import { Users, Loader2, Download, Mail, Phone } from 'lucide-react';

function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAlumniRegistrationOpen, setIsAlumniRegistrationOpen] = useState(false);
  const [isStudentRegistrationOpen, setIsStudentRegistrationOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentAPI.getAll();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    fetchStudents();
  };

  const filteredStudents = students.filter((student) => {
    if (activeFilter === 'Placed') return student.isPlaced;
    if (activeFilter === 'Unplaced') return !student.isPlaced;
    return true;
  });

  const placedCount = students.filter((student) => student.isPlaced).length;
  const totalCount = students.length;

  const dreamCompanies = [
    'Google', 'Microsoft', 'Amazon', 'Deloitte', 'TCS', 'IBM', 'Samsung', 'Atlassian',
    'Zomato', 'Paytm', 'Goldman Sachs', 'DE Shaw', 'Samsung SDS', 'Western Union',
    'Comviva', 'Hexaview', 'PlanetSpark', 'Josh Tech', 'Oracle', 'Adobe'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Welcome to HBTU Connect</h1>
        <p className="text-gray-600 mb-4">Connect with MCA students and alumni.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setIsStudentRegistrationOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Student Registration
          </button>
          <button
            onClick={() => setIsAlumniRegistrationOpen(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Alumni Registration
          </button>
        </div>
      </div>

      {/* Campus Recruitment Invitation */}
      <div className="bg-blue-50 rounded-lg shadow p-6 mb-6 border-l-4 border-blue-600">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Campus Recruitment Drive 2025</h2>
          <p className="text-lg text-gray-700 font-semibold">MCA 2024–26 Batch | HBTU Kanpur</p>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-gray-800">
            <span className="font-bold">Dear HR/Recruitment Team,</span>
          </p>
          <p className="text-gray-800">Greetings from HBTU Kanpur!</p>
          <p className="text-gray-800">
            I am <span className="font-bold text-blue-900">Chandra Shekhar</span>, Training & Placement Representative (2024-26). 
            We cordially invite your esteemed organization for our campus placement drive.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-4 mb-3">Why Recruit from HBTU MCA 2024-26?</h3>

          <ul className="space-y-2 text-gray-700">
            <li>• <span className="font-semibold">Admission via NIMCET</span> – Only Top 1000 All India Rankers</li>
            <li>• <span className="font-semibold">Batch Size:</span> 75 highly skilled students</li>
            <li>• <span className="font-semibold">Core Strengths:</span> AI/ML, MERN Stack, Spring Boot, Java, System Design, Cloud, DevOps</li>
            <li>• <span className="font-semibold">100% Internship Record</span></li>
            <li>• <span className="font-semibold">Average Package:</span> ₹6.0 LPA | <span className="font-semibold">Highest:</span> ₹17.5 LPA</li>
            <li>• <span className="font-semibold">Past Recruiters:</span> Samsung SDS, IBM, TCS, Comviva, Hexaview, Western Union, PlanetSpark, Josh Tech</li>
          </ul>

          <div className="text-center my-6">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Placement Brochure PDF
            </button>
          </div>

          <div className="bg-blue-600 text-white rounded-lg p-4 text-center">
            <h3 className="text-lg font-bold mb-3">Get in Touch</h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm">
              <a href="mailto:240231026@hbtu.ac.in" className="flex items-center gap-2 hover:underline">
                <Mail className="w-4 h-4" />
                240231026@hbtu.ac.in
              </a>
              <a href="tel:+918957465009" className="flex items-center gap-2 hover:underline">
                <Phone className="w-4 h-4" />
                +91 8957465009
              </a>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-700 mb-1">Warm Regards,</p>
            <p className="text-lg font-bold text-blue-900">Chandra Shekhar</p>
            <p className="text-gray-600 text-sm">Training & Placement Representative</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-2xl font-bold text-blue-600">{placedCount}</h3>
          <p className="text-gray-600 text-sm">Placed Students</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-2xl font-bold text-orange-600">{totalCount}</h3>
          <p className="text-gray-600 text-sm">Total Students</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-2xl font-bold text-green-600">75</h3>
          <p className="text-gray-600 text-sm">Batch Strength</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h3 className="text-2xl font-bold text-purple-600">100%</h3>
          <p className="text-gray-600 text-sm">Internship</p>
        </div>
      </div>

      {/* Placement Highlights */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Placement Highlights 2025</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <p className="text-lg font-bold text-blue-900">₹17.5 LPA</p>
            <p className="text-xs text-gray-600">Highest</p>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <p className="text-lg font-bold text-green-900">₹6.0 LPA</p>
            <p className="text-xs text-gray-600">Average</p>
          </div>
          <div className="bg-orange-100 px-4 py-2 rounded-lg">
            <p className="text-lg font-bold text-orange-900">100%</p>
            <p className="text-xs text-gray-600">Internship</p>
          </div>
          <div className="bg-purple-100 px-4 py-2 rounded-lg">
            <p className="text-lg font-bold text-purple-900">50+</p>
            <p className="text-xs text-gray-600">Offers</p>
          </div>
          <div className="bg-pink-100 px-4 py-2 rounded-lg">
            <p className="text-lg font-bold text-pink-900">30+</p>
            <p className="text-xs text-gray-600">Companies</p>
          </div>
        </div>
      </div>

      {/* Dream Companies */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Our Dream Companies</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {dreamCompanies.map((company, index) => (
            <span key={index} className="bg-gray-100 px-3 py-2 rounded text-sm font-semibold text-gray-700">
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Batch Strengths */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Batch Strengths</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-1">6+ Live Projects</h3>
            <p className="text-sm text-gray-600">Per student with real-world impact</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-1">Competitive Programming</h3>
            <p className="text-sm text-gray-600">Codeforces Rating ≥1600</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-1">50+ GitHub Contributors</h3>
            <p className="text-sm text-gray-600">Active open-source community</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-1">AWS/Azure Certified</h3>
            <p className="text-sm text-gray-600">Cloud-ready professionals</p>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Students</h2>
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading students...</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-medium">Error loading students</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchStudents}
              className="mt-2 text-sm text-red-800 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No students found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recruiting CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-lg shadow-lg p-6 text-center text-white mt-8">
        <h2 className="text-2xl font-bold mb-2">Recruiting? Talk to TPRs Directly</h2>
        <p className="mb-4">Get instant responses and schedule campus visits</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://wa.me/918957465009"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            WhatsApp TPR
          </a>
          <a
            href="mailto:240231026@hbtu.ac.in"
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Email TPR
          </a>
        </div>
      </div>

      <AlumniRegistration
        isOpen={isAlumniRegistrationOpen}
        onClose={() => setIsAlumniRegistrationOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />
      <StudentRegistration
        isOpen={isStudentRegistrationOpen}
        onClose={() => setIsStudentRegistrationOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}

export default Home;