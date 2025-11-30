import React, { useState, useEffect } from 'react';
import AlumniRegistration from '../components/AlumniRegistration';
import StudentRegistration from '../components/StudentRegistration';
import NotableAlumni from '../components/NotableAlumni';
import { alumniAPI } from '../utils/api';
import { Users, Loader2, Briefcase, Code, Linkedin, Mail } from 'lucide-react';

function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlumniRegistrationOpen, setIsAlumniRegistrationOpen] = useState(false);
  const [isStudentRegistrationOpen, setIsStudentRegistrationOpen] = useState(false);

  // Fetch alumni from API
  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alumniAPI.getAll();
      setAlumni(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setError(err.message || 'Failed to load alumni');
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    fetchAlumni(); // Refresh alumni list after registration
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">HBTU Alumni Network</h1>
        <p className="text-gray-600 mb-4">Connect with our successful graduates working across the globe.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setIsAlumniRegistrationOpen(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Alumni Registration
          </button>
          <button
            onClick={() => setIsStudentRegistrationOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Student Registration
          </button>
        </div>
      </div>

      {/* Notable Alumni Section */}
      <NotableAlumni />

      {/* Alumni Count */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-4 text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{alumni.length}</h3>
          <p className="text-gray-600 text-sm">Total Alumni</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading alumni...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">Error loading alumni</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchAlumni}
            className="mt-2 text-sm text-red-800 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Alumni Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {alumni.length > 0 ? (
            alumni.map((alumnus) => (
              <div key={alumnus.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5 border border-gray-100">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  {alumnus.image && alumnus.image !== 'https://i.ibb.co/TqK1XTQm/image-5.jpg' ? (
                    <img
                      src={alumnus.image}
                      alt={alumnus.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-orange-100"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl border-2 border-orange-100">
                      {alumnus.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{alumnus.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{alumnus.branch || 'MCA'}</p>
                    <p className="text-xs text-gray-500">Batch: {alumnus.batch}</p>
                  </div>
                </div>

                {/* Company */}
                {alumnus.company && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                    <Briefcase className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">{alumnus.company}</span>
                  </div>
                )}

                {/* Email */}
                {alumnus.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{alumnus.email}</span>
                  </div>
                )}

                {/* Tech Stack */}
                {alumnus.techStack && alumnus.techStack.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Code className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {alumnus.techStack.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-full border border-orange-100"
                        >
                          {tech}
                        </span>
                      ))}
                      {alumnus.techStack.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{alumnus.techStack.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* LinkedIn Link */}
                <div className="pt-3 border-t border-gray-100">
                  <a
                    href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(alumnus.name + ' ' + alumnus.company)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    View LinkedIn Profile
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No alumni found.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
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

export default Alumni;