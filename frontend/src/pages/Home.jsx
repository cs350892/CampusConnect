import React, { useState, useEffect } from 'react';
import StudentCard from '../components/StudentCard';
import FilterBar from '../components/FilterBar';
import AlumniRegistration from '../components/AlumniRegistration';
import StudentRegistration from '../components/StudentRegistration';
import { studentAPI } from '../utils/api';
import { Users, Loader2, Download, Mail, Phone, TrendingUp, Award, Briefcase, Code, GitBranch, Rocket, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 p-12 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">Welcome to HBTU Connect</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Bridging Dreams with Opportunities – MCA 2024-26 Batch</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setIsStudentRegistrationOpen(true)}
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Student Registration
              </button>
              <button
                onClick={() => setIsAlumniRegistrationOpen(true)}
                className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Award className="w-5 h-5" />
                Alumni Registration
              </button>
            </div>
          </div>
          {/* Wave Effect */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
              <path fill="#f8fafc" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        {/* Campus Recruitment Invitation */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-16 border border-white/50">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                🎓 Campus Recruitment Drive 2025
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 to-orange-600 bg-clip-text text-transparent mb-4">
                Invitation for Campus Recruitment
              </h2>
              <p className="text-xl text-gray-700 font-semibold">MCA 2024–26 Batch | HBTU Kanpur</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8 mb-8 border-l-4 border-blue-600">
              <p className="text-lg text-gray-800 mb-4">
                <span className="font-bold">Dear HR/Recruitment Team,</span>
              </p>
              <p className="text-lg text-gray-800 mb-4">Greetings from HBTU Kanpur!</p>
              <p className="text-lg text-gray-800 mb-6">
                I am <span className="font-bold text-blue-900">Chandra Shekhar</span>, Training & Placement Representative (2024-26). 
                We cordially invite your esteemed organization for our campus placement drive.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Rocket className="w-7 h-7 text-orange-600" />
                Why Recruit from HBTU MCA 2024-26?
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Admission via NIMCET</p>
                      <p className="text-gray-600">Only Top 1000 All India Rankers</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-orange-100">
                  <div className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Batch Size: 75 Students</p>
                      <p className="text-gray-600">Highly skilled & motivated</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Code className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Core Strengths</p>
                      <p className="text-gray-600">AI/ML, MERN, Spring Boot, Java, System Design, Cloud, DevOps</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-orange-100">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">100% Internship Record</p>
                      <p className="text-gray-600">Industry-ready from day one</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Average Package: ₹6.0 LPA</p>
                      <p className="text-gray-600">Highest: ₹17.5 LPA</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-orange-100">
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Past Recruiters</p>
                      <p className="text-gray-600">Samsung SDS, IBM, TCS, Comviva, Western Union, Josh Tech</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <button className="bg-gradient-to-r from-blue-600 to-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-orange-700 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3 mx-auto">
                  <Download className="w-7 h-7" />
                  Download Placement Brochure PDF
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-900 to-orange-600 text-white rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-lg">
                  <a href="mailto:240231026@hbtu.ac.in" className="flex items-center gap-2 hover:underline">
                    <Mail className="w-6 h-6" />
                    240231026@hbtu.ac.in
                  </a>
                  <a href="tel:+918957465009" className="flex items-center gap-2 hover:underline">
                    <Phone className="w-6 h-6" />
                    +91 8957465009
                  </a>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-700 text-lg mb-2">Warm Regards,</p>
                <p className="text-xl font-bold text-blue-900">Chandra Shekhar</p>
                <p className="text-gray-600">Training & Placement Representative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:scale-105 border border-blue-100">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">{placedCount}</h3>
            <p className="text-gray-600 font-medium">Placed Students</p>
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:scale-105 border border-orange-100">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">{totalCount}</h3>
            <p className="text-gray-600 font-medium">Total Students</p>
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:scale-105 border border-green-100">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">75</h3>
            <p className="text-gray-600 font-medium">Batch Strength</p>
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:scale-105 border border-purple-100">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">100%</h3>
            <p className="text-gray-600 font-medium">Internship</p>
          </div>
        </div>

        {/* Placement Highlights 2025 */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-8">
              <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-900 to-orange-600 bg-clip-text text-transparent mb-8">
                🏆 Placement Highlights 2025
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                    <p className="text-3xl font-bold">₹17.5 LPA</p>
                    <p className="text-sm opacity-90">Highest Package</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                    <p className="text-3xl font-bold">₹6.0 LPA</p>
                    <p className="text-sm opacity-90">Average Package</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                    <p className="text-3xl font-bold">100%</p>
                    <p className="text-sm opacity-90">Internship Record</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                    <p className="text-3xl font-bold">50+</p>
                    <p className="text-sm opacity-90">Offers Already</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-pink-500 to-pink-700 text-white px-6 py-4 rounded-2xl shadow-lg">
                    <p className="text-3xl font-bold">30+</p>
                    <p className="text-sm opacity-90">Companies Visiting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dream Companies */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-900 to-orange-600 bg-clip-text text-transparent mb-12">
            Our Dream Companies
          </h2>
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {dreamCompanies.map((company, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 text-center font-bold text-gray-800 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border border-blue-100 hover:border-blue-300"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Batch Strengths */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-900 to-orange-600 bg-clip-text text-transparent mb-12">
            💪 Batch Strengths
          </h2>
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start gap-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-xl transition-all border border-blue-200">
                <Code className="w-10 h-10 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">6+ Live Projects</h3>
                  <p className="text-gray-600">Per student with real-world impact</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 hover:shadow-xl transition-all border border-orange-200">
                <TrendingUp className="w-10 h-10 text-orange-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Competitive Programming</h3>
                  <p className="text-gray-600">Codeforces Rating ≥1600</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-xl transition-all border border-green-200">
                <GitBranch className="w-10 h-10 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">50+ GitHub Contributors</h3>
                  <p className="text-gray-600">Active open-source community</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-xl transition-all border border-purple-200">
                <Award className="w-10 h-10 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AWS/Azure Certified</h3>
                  <p className="text-gray-600">Cloud-ready professionals</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 hover:shadow-xl transition-all border border-pink-200">
                <Rocket className="w-10 h-10 text-pink-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hackathon Champions</h3>
                  <p className="text-gray-600">National-level winners</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 hover:shadow-xl transition-all border border-indigo-200">
                <Briefcase className="w-10 h-10 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Research Papers</h3>
                  <p className="text-gray-600">Published in IEEE & Springer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 to-orange-600 bg-clip-text text-transparent mb-4">
              Meet Our Talented Students
            </h2>
            <p className="text-xl text-gray-600">Tomorrow's Tech Leaders, Available Today</p>
          </div>
          
          <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <span className="ml-3 text-xl text-gray-600">Loading students...</span>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-5 rounded-2xl mb-6 shadow-lg">
              <p className="font-bold text-lg">Error loading students</p>
              <p className="text-base">{error}</p>
              <button
                onClick={fetchStudents}
                className="mt-3 text-base text-red-800 underline hover:no-underline font-semibold"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <Users className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600">No students found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recruiting CTA */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-12 text-center">
              <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Recruiting? Talk to TPRs Directly
              </h2>
              <p className="text-xl text-gray-600 mb-8">Get instant responses and schedule campus visits</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://wa.me/918957465009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-green-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3"
                >
                  <MessageCircle className="w-7 h-7" />
                  WhatsApp TPR
                </a>
                <a
                  href="mailto:240231026@hbtu.ac.in"
                  className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3"
                >
                  <Mail className="w-7 h-7" />
                  Email TPR
                </a>
              </div>
            </div>
          </div>
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

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Home;