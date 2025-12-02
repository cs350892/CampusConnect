import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, User, Mail, Calendar, LogOut, RefreshCw } from 'lucide-react';
import { getApiUrl } from '../utils/config';

const SimpleAdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin/login');
      return;
    }
    fetchPendingEntries();
  }, []);

  const fetchPendingEntries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getApiUrl()}/admin/pending-entries`);
      setStudents(response.data.students || []);
      setAlumni(response.data.alumni || []);
    } catch (error) {
      console.error('Error fetching pending entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, type) => {
    setProcessing(id);
    try {
      const endpoint = type === 'student' 
        ? `/admin/approve-student/${id}`
        : `/admin/approve-alumni/${id}`;
      
      await axios.post(`${getApiUrl()}${endpoint}`);
      
      // Remove from list
      if (type === 'student') {
        setStudents(students.filter(s => s._id !== id));
      } else {
        setAlumni(alumni.filter(a => a._id !== id));
      }
    } catch (error) {
      alert('Failed to approve');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id, type) => {
    if (!confirm('Are you sure you want to reject this entry?')) return;
    
    setProcessing(id);
    try {
      const endpoint = type === 'student'
        ? `/admin/reject-student/${id}`
        : `/admin/reject-alumni/${id}`;
      
      await axios.post(`${getApiUrl()}${endpoint}`);
      
      // Remove from list
      if (type === 'student') {
        setStudents(students.filter(s => s._id !== id));
      } else {
        setAlumni(alumni.filter(a => a._id !== id));
      }
    } catch (error) {
      alert('Failed to reject');
    } finally {
      setProcessing(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Registration Management</h1>
              <p className="text-sm text-gray-600">Review and approve new registrations</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchPendingEntries}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Students Pending</p>
                <p className="text-xl font-semibold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Alumni Pending</p>
                <p className="text-xl font-semibold text-gray-900">{alumni.length}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Pending Students */}
            {students.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Student Registrations</h2>
                <div className="bg-white border border-gray-200 rounded">
                  {students.map((student) => (
                    <div key={student._id} className="border-b last:border-b-0 p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{student.name}</h3>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                            <p>Email: {student.email}</p>
                            <p>Roll: {student.rollNumber}</p>
                            <p>Branch: {student.branch}</p>
                            <p>Batch: {student.batch}</p>
                            {student.phone && <p>Phone: {student.phone}</p>}
                            {student.techStack && <p className="col-span-2">Skills: {student.techStack}</p>}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">{new Date(student.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleApprove(student._id, 'student')}
                            disabled={processing === student._id}
                            className="px-4 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(student._id, 'student')}
                            disabled={processing === student._id}
                            className="px-4 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Alumni */}
            {alumni.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Alumni Registrations</h2>
                <div className="bg-white border border-gray-200 rounded">
                  {alumni.map((alum) => (
                    <div key={alum._id} className="border-b last:border-b-0 p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{alum.name}</h3>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                            <p>Email: {alum.email}</p>
                            <p>Company: {alum.company}</p>
                            <p>Branch: {alum.branch}</p>
                            <p>Batch: {alum.batch}</p>
                            {alum.phone && <p>Phone: {alum.phone}</p>}
                            {alum.techStack && alum.techStack.length > 0 && (
                              <p className="col-span-2">Skills: {alum.techStack.join(', ')}</p>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">{new Date(alum.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleApprove(alum._id, 'alumni')}
                            disabled={processing === alum._id}
                            className="px-4 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(alum._id, 'alumni')}
                            disabled={processing === alum._id}
                            className="px-4 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {students.length === 0 && alumni.length === 0 && (
              <div className="bg-white border border-gray-200 rounded p-8 text-center">
                <div className="text-gray-400 mb-3">
                  <CheckCircle className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">All caught up</h3>
                <p className="text-sm text-gray-500">No pending registrations right now</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;
