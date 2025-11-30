import { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, PageSpinner } from '../components/Spinner';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '' });
  const vantaRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const copyToClipboard = () => {
    if (user?.employeeId) {
      navigator.clipboard.writeText(user.employeeId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const isSameUTCDate = (d1, d2) => {
    const a = new Date(d1);
    const b = new Date(d2);
    return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
  };

  const fetchStatsLogsAndLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, lRes, vRes] = await Promise.all([
        api.get('/stats/me'),
        api.get('/attendance/me'),
        api.get('/leaves/me')
      ]);
      setStats(sRes.data);
      setLogs(lRes.data || []);
      setLeaves(vRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatsLogsAndLeaves();
  }, [fetchStatsLogsAndLeaves]);

  useEffect(() => {
    const initVanta = () => {
      if (!vantaRef.current) return;
      
      try {
        // Clear any existing Vanta instance
        if (vantaRef.current.vantaInstance) {
          vantaRef.current.vantaInstance.destroy();
        }
        
        // Initialize Vanta Birds
        const effect = window.VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          backgroundColor: 0xf8f9fa,
          color: 0x2563eb,
          colorSecondary: 0x1e40af,
          quantity: 4
        });
        
        // Store instance for cleanup
        if (vantaRef.current) {
          vantaRef.current.vantaInstance = effect;
        }
      } catch (error) {
        console.warn('Vanta BIRDS initialization failed:', error);
      }
    };

    // Try immediate initialization
    if (window.VantaReady && window.VANTA && window.VANTA.BIRDS) {
      initVanta();
    } else if (window.VantaReady) {
      // Wait for vantaReady event
      const handleVantaReady = () => {
        initVanta();
      };
      document.addEventListener('vantaReady', handleVantaReady);
      return () => document.removeEventListener('vantaReady', handleVantaReady);
    } else {
      // Fallback: check periodically
      const checkVanta = setInterval(() => {
        if (window.VANTA && window.VANTA.BIRDS) {
          clearInterval(checkVanta);
          initVanta();
        }
      }, 100);
      
      return () => {
        clearInterval(checkVanta);
        // Cleanup on unmount
        if (vantaRef.current && vantaRef.current.vantaInstance) {
          vantaRef.current.vantaInstance.destroy();
        }
      };
    }
  }, []);

  const todayOpen = logs.find((l) => {
    // open if same day and no clockOutTime
    return isSameUTCDate(l.date, new Date()) && !l.clockOutTime;
  });

  const handleClockIn = async () => {
    if (todayOpen) {
      toast.error('You are already clocked in for today');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/attendance/clock-in');
      await fetchStatsLogsAndLeaves();
      toast.success(`Clocked in at ${new Date(res.data.clockInTime).toLocaleTimeString()}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Clock in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!todayOpen) {
      toast.error('No active clock-in found for today');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/attendance/clock-out');
      await fetchStatsLogsAndLeaves();
      toast.success(`Clocked out at ${new Date(res.data.clockOutTime).toLocaleTimeString()}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Clock out failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/employee/login');
    toast.success('Logged out successfully');
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast.error('Please fill all fields');
      return;
    }
    if (new Date(leaveForm.startDate) > new Date(leaveForm.endDate)) {
      toast.error('End date must be after start date');
      return;
    }
    setSubmittingLeave(true);
    try {
      await api.post('/leaves', leaveForm);
      toast.success('Leave request submitted successfully!');
      setLeaveForm({ startDate: '', endDate: '', reason: '' });
      setShowLeaveModal(false);
      await fetchStatsLogsAndLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setSubmittingLeave(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen relative">
      <div 
        ref={vantaRef}
        className="fixed inset-0 -z-10"
      > </div>
      <div className="relative z-10 p-6">
      {/* Modal for Apply Leave */}
      {showLeaveModal && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-2 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Apply for Leave</h2>
                <p className="text-sm text-gray-600 mt-1">{user?.employeeId}</p>
              </div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitLeave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={submittingLeave}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={submittingLeave}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Enter your reason..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  disabled={submittingLeave}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  disabled={submittingLeave}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLeave}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingLeave ? (
                    <>
                      <Spinner size="sm" className="text-white" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Manage your attendance and leave</p>
        </div>

        {/* Profile Card */}
        {user && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm text-gray-600 font-medium mb-2">Employee ID</h3>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-blue-700">{user.employeeId}</div>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 text-xs bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition font-medium"
                    title="Copy ID to clipboard"
                  >
                    {copiedId ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-600 font-medium mb-2">Email</h3>
                <p className="text-lg text-gray-800">{user.email}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-600 font-medium mb-2">Name</h3>
                <p className="text-lg text-gray-800">{user.name}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-600 font-medium mb-2">Role</h3>
                <p className="text-lg font-semibold">
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                    Employee
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 font-medium">Days Worked</div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a6 6 0 016 6v3a3 3 0 01-3 3H7a1 1 0 100 2h2a5 5 0 005-5v-3a8 8 0 00-8-8H6a1 1 0 000-2h-2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.daysWorkedThisMonth ?? 0}</div>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 font-medium">Leave Balance</div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.5 1.5H19a1 1 0 011 1v1h.5a1 1 0 110 2h-.5v4h.5a1 1 0 110 2h-.5v4h.5a1 1 0 110 2h-.5v1a1 1 0 01-1 1h-8.5a.5.5 0 110-1H19v-1H10.5a.5.5 0 110-1v-4a.5.5 0 110 1v4H1a1 1 0 01-1-1v-1h-.5a1 1 0 110-2h.5v-4h-.5a1 1 0 110-2h.5v-4h-.5a1 1 0 010-2h.5V2.5a1 1 0 011-1H10.5a.5.5 0 110 1z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.leaveBalance ?? 0} <span className="text-lg text-gray-500">days</span></div>
            <p className="text-xs text-gray-500 mt-2">{stats?.totalApprovedLeaveDays ?? 0} days used</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 font-medium">Approved Leaves</div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.006a3.066 3.066 0 01-3.062 3.062H5.5a3.066 3.066 0 01-3.062-3.062V6.517a3.066 3.066 0 012.812-3.062zm7.958 5.953a.75.75 0 00-1.06-1.06L7.07 9.047a.75.75 0 00-1.054.072l-1.693-1.63a.75.75 0 00-1.06 1.06l2.505 2.41a.75.75 0 001.06-.023l4.38-4.353z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.approvedLeavesThisMonth ?? 0}</div>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>
        </div>

        {/* Clock In/Out and Leaves Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Clock and Attendance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Clock In/Out Section */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Clock In/Out</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleClockIn}
                  disabled={actionLoading || !!todayOpen}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actionLoading && <Spinner size="sm" className="text-white" />}
                  {todayOpen ? 'Already Clocked In' : 'Clock In'}
                </button>

                <button
                  onClick={handleClockOut}
                  disabled={actionLoading || !todayOpen}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actionLoading && <Spinner size="sm" className="text-white" />}
                  Clock Out
                </button>
              </div>
            </div>

            {/* Attendance Records */}
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Attendance</h3>
              {logs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No attendance records yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Clock In</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Clock Out</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((l) => (
                        <tr key={l._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(l.date).toDateString()}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{l.clockInTime ? new Date(l.clockInTime).toLocaleTimeString() : '—'}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{l.clockOutTime ? new Date(l.clockOutTime).toLocaleTimeString() : '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${l.clockOutTime ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {l.clockOutTime ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Leaves */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Leaves</h2>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Apply
                </button>
              </div>

              {leaves.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 font-medium text-sm">No leave requests</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {leaves.map((l) => (
                    <div key={l._id} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 font-medium">Start</p>
                          <p className="text-sm font-semibold text-gray-900">{new Date(l.startDate).toDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${
                          l.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          l.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium mb-1">End</p>
                      <p className="text-sm text-gray-700">{new Date(l.endDate).toDateString()}</p>
                      <p className="text-xs text-gray-600 mt-2 truncate" title={l.reason}>{l.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
