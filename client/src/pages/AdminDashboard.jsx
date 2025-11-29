import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageSpinner, Spinner } from '../components/Spinner';
import api from '../api/axiosClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [showLeavesModal, setShowLeavesModal] = useState(false);
  const [actioningId, setActioningId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const vantaRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const copyToClipboard = () => {
    if (user?.employeeId) {
      navigator.clipboard.writeText(user.employeeId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [statsRes, leavesRes] = await Promise.all([
        api.get('/stats/admin'),
        api.get('/leaves?status=Pending')
      ]);
      setStats(statsRes.data);
      setLeaves(leavesRes.data || []);
    } catch (err) {
      setStats(null);
      toast.error(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const element = vantaRef.current || document.querySelector('.fixed.inset-0.z-0');
      
      if (element && typeof window.VANTA !== 'undefined' && window.VANTA.BIRDS) {
        try {
          window.VANTA.BIRDS({
            el: element,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 1,
            backgroundColor: 0xffffff,
            color: 0x1e3a8a,
            colorSecondary: 0x3b82f6
          });
        } catch (error) {
          // Vanta initialization failed
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const updateLeaveStatus = async (id, status) => {
    setActioningId(id);
    try {
      await api.patch(`/leaves/${id}/status`, { status });
      toast.success(`Leave ${status.toLowerCase()} successfully!`);
      setLeaves(leaves.filter(l => l._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update leave');
    } finally {
      setActioningId(null);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen relative">
      <div 
        ref={vantaRef}
        className="fixed inset-0 -z-10"
      />
      <div className="relative z-10 p-6">
      {/* Modal for Review Leaves */}
      {showLeavesModal && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-20 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Pending Leave Requests ({leaves.length})</h2>
              <button
                onClick={() => setShowLeavesModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {leaves.length === 0 ? (
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No pending leave requests</p>
                </div>
              ) : (
                leaves.map((l) => (
                  <div key={l._id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
                    <div className="mb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{l.user?.name || l.user?.email}</p>
                          <p className="text-sm text-gray-600">{l.user?.email}</p>
                          <p className="text-xs text-gray-500 mt-1">ID: {l.user?.employeeId}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">{new Date(l.startDate).toDateString()}</span> to <span className="font-medium">{new Date(l.endDate).toDateString()}</span>
                        <span className="text-gray-500 ml-2">({Math.ceil((new Date(l.endDate) - new Date(l.startDate)) / (1000 * 60 * 60 * 24)) + 1} days)</span>
                      </p>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{l.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateLeaveStatus(l._id, 'Approved')}
                        disabled={actioningId === l._id}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-70 flex items-center justify-center gap-1"
                      >
                        {actioningId === l._id ? (
                          <>
                            <Spinner size="sm" className="text-white" />
                            Approving...
                          </>
                        ) : (
                          'Approve'
                        )}
                      </button>
                      <button 
                        onClick={() => updateLeaveStatus(l._id, 'Rejected')}
                        disabled={actioningId === l._id}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-70 flex items-center justify-center gap-1"
                      >
                        {actioningId === l._id ? (
                          <>
                            <Spinner size="sm" className="text-white" />
                            Rejecting...
                          </>
                        ) : (
                          'Reject'
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Manage attendance and leave applications</p>
        </div>

        {/* Profile Card */}
        {user && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <h3 className="text-sm text-gray-600 font-medium mb-2">Admin ID</h3>
                <p className="text-2xl font-bold text-red-700">{user.employeeId}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-600 font-medium mb-2">Name</h3>
                <p className="text-lg text-gray-800">{user.name}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-600 font-medium mb-2">Email</h3>
                <p className="text-lg text-gray-800">{user.email}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-600 font-medium mb-2">Role</h3>
                <p className="text-lg font-semibold">
                  <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                    Administrator
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-sm text-gray-600 font-medium mb-2">Status</h3>
                <p className="text-lg font-semibold">
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                    Active
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 font-medium">Pending Leaves</div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.pendingLeavesCount ?? 0}</div>
            <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 font-medium">Absent Today</div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" /><path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2V2a1 1 0 112 0v1h1a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v1a2 2 0 01-2 2h-1v1a1 1 0 11-2 0v-1h-2v1a1 1 0 11-2 0v-1H7v1a1 1 0 11-2 0v-1H4a2 2 0 01-2-2v-1H1a1 1 0 110-2h1v-2H1a1 1 0 010-2h1V9H1a1 1 0 110-2h1V6a2 2 0 012-2h1V2a1 1 0 010-2zm12 2v12H1V4h18z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.absentToday ? stats.absentToday.length : 0}</div>
            <p className="text-xs text-gray-500 mt-2">Employees</p>
          </div>


        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <button 
            onClick={() => navigate('/admin/attendance')} 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:shadow-lg transition"
          >
            📊 View Attendance
          </button>
          <button 
            onClick={() => setShowLeavesModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold text-lg hover:shadow-lg transition relative"
          >
            📋 Review Leaves
            {leaves.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center">
                {leaves.length}
              </span>
            )}
          </button>
        </div>

        {/* Absent Employees */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Absent Employees Today</h2>
          {(!stats?.absentToday || stats.absentToday.length === 0) ? (
            <div className="text-center py-12">
              <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium text-lg">No absentees detected</p>
              <p className="text-gray-500 text-sm mt-1">All employees have clocked in today</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.absentToday.map((e) => (
                <div key={e._id} className="p-4 border border-red-200 rounded-xl bg-red-50 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{e.name || e.email}</p>
                      <p className="text-sm text-gray-600">{e.email}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {e.employeeId}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-200 text-red-700 rounded-full text-xs font-semibold">
                      Absent
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
