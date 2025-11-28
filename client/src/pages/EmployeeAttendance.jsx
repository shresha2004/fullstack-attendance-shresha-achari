import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const EmployeeAttendance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/attendance/me?month=${month}&year=${year}`);
      setLogs(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">My Attendance</h2>
        <button onClick={() => navigate('/employee')} className="px-3 py-1 border rounded">Back</button>
      </div>

      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

      <div className="mb-4 flex gap-2">
        <label className="text-sm">
          Month:
          <input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(Number(e.target.value))} className="ml-1 border p-1 w-16" />
        </label>
        <label className="text-sm">
          Year:
          <input type="number" min="2020" max="2100" value={year} onChange={(e) => setYear(Number(e.target.value))} className="ml-1 border p-1 w-20" />
        </label>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-500">No attendance records for {month}/{year}.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Clock In</th>
                <th className="border border-gray-300 p-2">Clock Out</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{new Date(log.date).toDateString()}</td>
                  <td className="border border-gray-300 p-2">{log.clockInTime ? new Date(log.clockInTime).toLocaleTimeString() : '—'}</td>
                  <td className="border border-gray-300 p-2">{log.clockOutTime ? new Date(log.clockOutTime).toLocaleTimeString() : '—'}</td>
                  <td className="border border-gray-300 p-2">
                    {log.clockInTime && !log.clockOutTime ? (
                      <span className="text-yellow-600">In Progress</span>
                    ) : log.clockInTime && log.clockOutTime ? (
                      <span className="text-green-600">Complete</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
