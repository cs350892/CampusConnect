import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Shield, Users, UserCheck, UserX, Clock, 
  TrendingUp, LogOut, CheckCircle, XCircle, 
  Eye, Search, Filter, RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchDashboardData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const [statsRes, studentsRes, alumniRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin-approval/stats`, getAuthHeaders()),
        axios.get(`${API_URL}/api/admin-approval/students/pending`, getAuthHeaders()),
        axios.get(`${API_URL}/api/admin-approval/alumni/pending`, getAuthHeaders())
      ]);

      setStats(statsRes.data.stats);
      setPendingStudents(studentsRes.data.students || []);
      setPendingAlumni(alumniRes.data.alumni || []);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const handleApprove = async (id, type) => {
    if (!confirm(`Are you sure you want to approve this ${type}?`)) return;

    setActionLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(
        `${API_URL}/api/admin-approval/${type}/${id}/approve`,
        {},
        getAuthHeaders()
      );

      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully!`);
      fetchDashboardData();

    } catch (error) {
      alert(error.response?.data?.message || `Failed to approve ${type}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, type) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required');
      return;
    }

    setActionLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(
        `${API_URL}/api/admin-approval/${type}/${id}/reject`,
        { reason },
        getAuthHeaders()
      );

      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} rejected`);
      fetchDashboardData();

    } catch (error) {
      alert(error.response?.data?.message || `Failed to reject ${type}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkApprove = async (type) => {
    if (selectedItems.length === 0) {
      alert('Please select items to approve');
      return;
    }

    if (!confirm(`Approve ${selectedItems.length} ${type}(s)?`)) return;

    setActionLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const idsKey = type === 'students' ? 'studentIds' : 'alumniIds';
      
      await axios.post(
        `${API_URL}/api/admin-approval/${type}/bulk-approve`,
        { [idsKey]: selectedItems },
        getAuthHeaders()
      );

      alert(`${selectedItems.length} ${type} approved successfully!`);
      setSelectedItems([]);
      fetchDashboardData();

    } catch (error) {
      alert(error.response?.data?.message || 'Bulk approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (items) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item._id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">CampusConnect Approval System</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4 border-b">
            {['dashboard', 'students', 'alumni'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedItems([]);
                  setSearchTerm('');
                }}
                className={`px-6 py-2 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && stats && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Students Stats */}
              <StatCard
                title="Total Students"
                value={stats.students.total}
                icon={<Users />}
                color="blue"
              />
              <StatCard
                title="Pending Students"
                value={stats.students.pending}
                icon={<Clock />}
                color="yellow"
              />
              <StatCard
                title="Total Alumni"
                value={stats.alumni.total}
                icon={<Users />}
                color="purple"
              />
              <StatCard
                title="Pending Alumni"
                value={stats.alumni.pending}
                icon={<Clock />}
                color="orange"
              />
            </div>

            {/* Approval Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Students Approval Status */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Student Approvals
                </h3>
                <div className="space-y-3">
                  <ApprovalRow
                    label="Approved"
                    value={stats.students.approved}
                    total={stats.students.total}
                    color="green"
                  />
                  <ApprovalRow
                    label="Pending"
                    value={stats.students.pending}
                    total={stats.students.total}
                    color="yellow"
                  />
                  <ApprovalRow
                    label="Rejected"
                    value={stats.students.rejected}
                    total={stats.students.total}
                    color="red"
                  />
                </div>
              </div>

              {/* Alumni Approval Status */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Alumni Approvals
                </h3>
                <div className="space-y-3">
                  <ApprovalRow
                    label="Approved"
                    value={stats.alumni.approved}
                    total={stats.alumni.total}
                    color="green"
                  />
                  <ApprovalRow
                    label="Pending"
                    value={stats.alumni.pending}
                    total={stats.alumni.total}
                    color="yellow"
                  />
                  <ApprovalRow
                    label="Rejected"
                    value={stats.alumni.rejected}
                    total={stats.alumni.total}
                    color="red"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <PendingList
            title="Pending Student Approvals"
            items={pendingStudents}
            type="students"
            selectedItems={selectedItems}
            onToggleSelect={toggleSelectItem}
            onToggleSelectAll={toggleSelectAll}
            onApprove={handleApprove}
            onReject={handleReject}
            onBulkApprove={handleBulkApprove}
            onRefresh={fetchDashboardData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            actionLoading={actionLoading}
          />
        )}

        {activeTab === 'alumni' && (
          <PendingList
            title="Pending Alumni Approvals"
            items={pendingAlumni}
            type="alumni"
            selectedItems={selectedItems}
            onToggleSelect={toggleSelectItem}
            onToggleSelectAll={toggleSelectAll}
            onApprove={handleApprove}
            onReject={handleReject}
            onBulkApprove={handleBulkApprove}
            onRefresh={fetchDashboardData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            actionLoading={actionLoading}
          />
        )}
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-orange-500',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-red-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white`}>
          {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
      </div>
    </div>
  );
};

// Approval Row Component
const ApprovalRow = ({ label, value, total, color }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">{value} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color]} transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Pending List Component
const PendingList = ({
  title,
  items,
  type,
  selectedItems,
  onToggleSelect,
  onToggleSelectAll,
  onApprove,
  onReject,
  onBulkApprove,
  onRefresh,
  searchTerm,
  setSearchTerm,
  actionLoading
}) => {
  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {selectedItems.length > 0 && (
            <button
              onClick={() => onBulkApprove(type)}
              disabled={actionLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve Selected ({selectedItems.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="divide-y">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No pending {type} found</p>
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="p-4 bg-gray-50">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredItems.length}
                  onChange={() => onToggleSelectAll(filteredItems)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({filteredItems.length})
                </span>
              </label>
            </div>

            {filteredItems.map((item) => (
              <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => onToggleSelect(item._id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                  />

                  <img
                    src={item.imageUrl || 'https://i.ibb.co/TqK1XTQm/image-5.jpg'}
                    alt={item.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div><strong>Email:</strong> {item.email}</div>
                      <div><strong>Batch:</strong> {item.batch}</div>
                      {item.rollNumber && <div><strong>Roll No:</strong> {item.rollNumber}</div>}
                      {item.company && <div><strong>Company:</strong> {item.company}</div>}
                      {item.branch && <div><strong>Branch:</strong> {item.branch}</div>}
                      {item.phone && <div><strong>Phone:</strong> {item.phone}</div>}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Registered: {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => onApprove(item._id, type)}
                      disabled={actionLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onReject(item._id, type)}
                      disabled={actionLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
