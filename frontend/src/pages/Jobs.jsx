import React, { useState, useEffect } from 'react';
import { Loader2, Briefcase, MapPin, Building2, ExternalLink, Mail, Calendar, Plus } from 'lucide-react';
import axios from 'axios';
import JobPostForm from '../components/JobPostForm';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobPosted = () => {
    fetchJobs(); // Refresh jobs list
    setShowPostForm(false);
  };

  const filteredJobs = jobs.filter(job =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Job Opportunities</h1>
            <p className="text-gray-600">Browse and post job opportunities for HBTU alumni and students</p>
          </div>
          <button
            onClick={() => setShowPostForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Post a Job
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Search by job title, company, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading jobs...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">Error loading jobs</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchJobs}
            className="mt-2 text-sm text-red-800 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Jobs List */}
      {!loading && !error && (
        <>
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{job.jobTitle}</h2>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span>{job.companyName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          <span>Posted by: <span className="font-semibold">{job.postedBy}</span></span>
                        </div>
                        {job.email && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${job.email}`} className="hover:text-blue-600 hover:underline">
                              {job.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <a
                        href={job.applicationLink.startsWith('http') ? job.applicationLink : `https://${job.applicationLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-semibold"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to post a job opportunity!'}
              </p>
              <button
                onClick={() => setShowPostForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Post a Job
              </button>
            </div>
          )}
        </>
      )}

      {/* Job Post Form Modal */}
      {showPostForm && (
        <JobPostForm
          onClose={() => setShowPostForm(false)}
          onSuccess={handleJobPosted}
        />
      )}
    </div>
  );
}

export default Jobs;
