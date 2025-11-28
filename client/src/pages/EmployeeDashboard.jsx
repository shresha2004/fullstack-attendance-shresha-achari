import { useEffect, useState, useCallback } from 'react';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const navigate = useNavigate();
  const { token, user } = useAuth();

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

  const fetchStatsAndLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sRes, lRes] = await Promise.all([
        api.get('/stats/me'),
        api.get('/attendance/me')
      ]);
      setStats(sRes.data);
      setLogs(lRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatsAndLogs();
  }, [fetchStatsAndLogs]);

  const todayOpen = logs.find((l) => {
    // open if same day and no clockOutTime
    return isSameUTCDate(l.date, new Date()) && !l.clockOutTime;
  });

  const handleClockIn = async () => {
    setError('');
    if (todayOpen) {
      setError('You are already clocked in for today.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/attendance/clock-in');
      // refresh
      await fetchStatsAndLogs();
      alert('Clocked in at ' + new Date(res.data.clockInTime).toLocaleTimeString());
    } catch (err) {
      setError(err.response?.data?.message || 'Clock in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    setError('');
    if (!todayOpen) {
      setError('No active clock-in found for today.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/attendance/clock-out');
      await fetchStatsAndLogs();
      alert('Clocked out at ' + new Date(res.data.clockOutTime).toLocaleTimeString());
    } catch (err) {
      setError(err.response?.data?.message || 'Clock out failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">Employee Dashboard</h2>

      {/* Profile Card */}
      {user && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-gray-600 font-medium mb-1">Employee ID</h3>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-700">{user.employeeId}</div>
                <button
                  onClick={copyToClipboard}
                  className="px-2 py-1 text-xs bg-white border border-blue-300 rounded hover:bg-blue-50"
                  title="Copy ID to clipboard"
                >
                  {copiedId ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-600 font-medium mb-1">Name</h3>
              <p className="text-lg text-gray-800">{user.name}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-600 font-medium mb-1">Email</h3>
              <p className="text-lg text-gray-800">{user.email}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-600 font-medium mb-1">Role</h3>
              <p className="text-lg font-semibold">
                <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {user.role === 'admin' ? 'Administrator' : 'Employee'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Days Worked This Month</div>
          <div className="text-2xl font-bold">{stats?.daysWorkedThisMonth ?? 0}</div>
        </div>

        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Leave Balance</div>
          <div className="text-2xl font-bold text-blue-600">{stats?.leaveBalance ?? 0} days</div>
          <div className="text-xs text-gray-500">({stats?.totalApprovedLeaveDays ?? 0} used)</div>
        </div>

        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Approved Leaves</div>
          <div className="text-2xl font-bold">{stats?.approvedLeavesThisMonth ?? 0}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleClockIn}
          disabled={actionLoading || !!todayOpen}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
        >
          Clock In
        </button>

        <button
          onClick={handleClockOut}
          disabled={actionLoading || !todayOpen}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-60"
        >
          Clock Out
        </button>

        <button onClick={() => navigate('/employee/attendance')} className="px-3 py-2 border rounded">View Attendance</button>
        <button onClick={() => navigate('/employee/leaves')} className="px-3 py-2 border rounded">Leaves</button>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" checked={showToken} onChange={() => setShowToken(s => !s)} className="mr-2" />
          Show stored JWT (debug)
        </label>
        {showToken && (
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{token || localStorage.getItem('token') || 'No token'}</pre>
        )}
      </div>

      <div>
        <h3 className="font-medium mb-2">Recent Attendance</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">No attendance records yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((l) => (
              <li key={l._id} className="p-2 border rounded">
                <div className="text-sm">Date: {new Date(l.date).toDateString()}</div>
                <div className="text-sm">Clock In: {l.clockInTime ? new Date(l.clockInTime).toLocaleTimeString() : '—'}</div>
                <div className="text-sm">Clock Out: {l.clockOutTime ? new Date(l.clockOutTime).toLocaleTimeString() : '—'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
