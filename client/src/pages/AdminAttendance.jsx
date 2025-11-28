import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AdminAttendance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [userId, setUserId] = useState('');
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      // We'll fetch all users from a hypothetical endpoint or just allow manual entry
      // For now, we'll rely on the admin selecting by email or user ID
    } catch (err) {
      console.error('Failed to fetch employees');
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('month', month);
      params.append('year', year);
      if (userId) params.append('userId', userId);

      const res = await api.get(`/attendance?${params.toString()}`);
      setLogs(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [month, year, userId]);

  const groupLogsByUser = () => {
    const grouped = {};
    logs.forEach((log) => {
      const userEmail = log.user?.email || log.user || 'Unknown';
      if (!grouped[userEmail]) {
        grouped[userEmail] = [];
      }
      grouped[userEmail].push(log);
    });
    return grouped;
  };

  const groupedLogs = groupLogsByUser();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Attendance Logs</h2>
        <button onClick={() => navigate('/admin')} className="px-3 py-1 border rounded">Back</button>
      </div>

      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

      <div className="mb-4 p-4 border rounded bg-gray-50 space-y-2">
        <div className="flex flex-wrap gap-4">
          <label className="text-sm">
            Month:
            <input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(Number(e.target.value))} className="ml-1 border p-1 w-16" />
          </label>
          <label className="text-sm">
            Year:
            <input type="number" min="2020" max="2100" value={year} onChange={(e) => setYear(Number(e.target.value))} className="ml-1 border p-1 w-20" />
          </label>
          <label className="text-sm">
            Employee ID (optional):
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Leave blank for all" className="ml-1 border p-1 w-32" />
          </label>
          <button onClick={fetchAttendance} className="px-3 py-1 bg-blue-600 text-white rounded">Filter</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-500">No attendance records found for the selected filters.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([userEmail, userLogs]) => (
            <div key={userEmail} className="border rounded p-4 bg-white">
              <h3 className="text-lg font-medium mb-3">📧 {userEmail}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2">Date</th>
                      <th className="border border-gray-300 p-2">Clock In</th>
                      <th className="border border-gray-300 p-2">Clock Out</th>
                      <th className="border border-gray-300 p-2">Duration</th>
                      <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLogs
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
                          <tr key={log._id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{new Date(log.date).toDateString()}</td>
                            <td className="border border-gray-300 p-2">{log.clockInTime ? new Date(log.clockInTime).toLocaleTimeString() : '—'}</td>
                            <td className="border border-gray-300 p-2">{log.clockOutTime ? new Date(log.clockOutTime).toLocaleTimeString() : '—'}</td>
                            <td className="border border-gray-300 p-2 font-medium">{duration}</td>
                            <td className="border border-gray-300 p-2">
                              {log.clockInTime && !log.clockOutTime ? (
                                <span className="text-yellow-600 font-medium">In Progress</span>
                              ) : log.clockInTime && log.clockOutTime ? (
                                <span className="text-green-600 font-medium">Complete</span>
                              ) : (
                                <span className="text-gray-500">—</span>
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
  );
};

export default AdminAttendance;
