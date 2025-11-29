import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminAttendance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/attendance/employees');
      setEmployees(res.data || []);
    } catch (err) {
      // Failed to fetch employees
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('month', month);
      params.append('year', year);
      if (searchQuery) {
        // First, find the employee ID from the search query
        const matchedEmployee = employees.find(emp => 
          emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchedEmployee) {
          params.append('userId', matchedEmployee._id);
        }
      }

      const res = await api.get(`/attendance?${params.toString()}`);
      setLogs(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance');
      toast.error(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [month, year, searchQuery]);

  const groupLogsByUser = () => {
    const grouped = {};
    logs.forEach((log) => {
      const userId = log.user?._id || 'Unknown';
      const userName = log.user?.name || log.user?.email || 'Unknown';
      const userEmail = log.user?.email || 'Unknown';
      const employeeId = log.user?.employeeId || 'Unknown';
      if (!grouped[userId]) {
        grouped[userId] = {
          logs: [],
          name: userName,
          email: userEmail,
          employeeId: employeeId
        };
      }
      grouped[userId].logs.push(log);
    });
    return grouped;
  };

  const groupedLogs = groupLogsByUser();

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Attendance Logs</h1>
            <p className="text-gray-600">View and manage employee attendance records</p>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate('/');
              toast.success('Logged out successfully');
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter Attendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 font-medium mb-2">Month</label>
              <input 
                type="number" 
                min="1" 
                max="12" 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 font-medium mb-2">Year</label>
              <input 
                type="number" 
                min="2020" 
                max="2100" 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 font-medium mb-2">Search by Employee ID/Name/Email</label>
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., UCUBE-1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        {logs.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium text-lg">No attendance records found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedLogs).map(([userId, userData]) => (
              <div key={userId} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">{userData.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Employee ID</p>
                      <p className="text-sm font-semibold text-blue-700">{userData.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Email</p>
                      <p className="text-sm text-gray-700">{userData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Total Records</p>
                      <p className="text-sm font-semibold text-gray-900">{userData.logs.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Clock In</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Clock Out</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.logs
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((log) => {
                          let duration = '—';
                          if (log.clockInTime && log.clockOutTime) {
                            const inTime = new Date(log.clockInTime);
                            const outTime = new Date(log.clockOutTime);
                            const diffMs = outTime - inTime;
                            const hours = Math.floor(diffMs / (1000 * 60 * 60));
                            const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            duration = `${hours}h ${mins}m`;
                          }

                          return (
                            <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-sm text-gray-600">{new Date(log.date).toDateString()}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.clockInTime ? new Date(log.clockInTime).toLocaleTimeString() : '—'}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.clockOutTime ? new Date(log.clockOutTime).toLocaleTimeString() : '—'}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{duration}</td>
                              <td className="px-4 py-3">
                                {log.clockInTime && !log.clockOutTime ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">In Progress</span>
                                ) : log.clockInTime && log.clockOutTime ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Complete</span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
