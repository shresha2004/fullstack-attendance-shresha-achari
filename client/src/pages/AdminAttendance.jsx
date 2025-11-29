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
  const [presentToday, setPresentToday] = useState([]);
  const [absentToday, setAbsentToday] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

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
      
      // Calculate present and absent for selected date
      calculateTodayAttendance(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance');
      toast.error(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const calculateTodayAttendance = (logsData) => {
    const selectedDateObj = new Date(selectedDate);
    const present = [];
    const absent = [];
    const presentUserIds = new Set();

    // Find all employees who have attendance records for the selected date
    logsData.forEach((log) => {
      const logDate = new Date(log.date);
      if (logDate.toDateString() === selectedDateObj.toDateString()) {
        if (log.clockInTime) {
          const user = log.user;
          if (user && !presentUserIds.has(user._id)) {
            present.push({
              _id: user._id,
              name: user.name,
              email: user.email,
              employeeId: user.employeeId,
              clockInTime: log.clockInTime,
              clockOutTime: log.clockOutTime
            });
            presentUserIds.add(user._id);
          }
        }
      }
    });

    // Find absent employees (those not in present list)
    if (employees.length > 0) {
      employees.forEach((emp) => {
        if (!presentUserIds.has(emp._id)) {
          absent.push({
            _id: emp._id,
            name: emp.name,
            email: emp.email,
            employeeId: emp.employeeId
          });
        }
      });
    }

    setPresentToday(present);
    setAbsentToday(absent);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [month, year, searchQuery]);

  useEffect(() => {
    if (logs.length > 0) {
      calculateTodayAttendance(logs);
    }
  }, [selectedDate]);

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Attendance Dashboard</h1>
          <p className="text-gray-600">View present and absent employees for today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Date and Filters */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filters & Date Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 font-medium mb-2">Select Date</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
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
              <label className="block text-sm text-gray-600 font-medium mb-2">Search Employee</label>
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ID/Name/Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Present and Absent Employees */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Present Employees */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Present Employees</h2>
                <p className="text-sm text-gray-600">{presentToday.length} present today</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {presentToday.length === 0 ? (
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No present employees</p>
                </div>
              ) : (
                presentToday.map((emp) => (
                  <div key={emp._id} className="p-4 border border-green-200 rounded-lg bg-green-50 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-600">{emp.email}</p>
                        <p className="text-xs font-medium text-green-700 mt-1">{emp.employeeId}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                          {emp.clockInTime && (
                            <>
                              <span className="font-medium">In: {new Date(emp.clockInTime).toLocaleTimeString()}</span>
                              {emp.clockOutTime && (
                                <span className="font-medium">Out: {new Date(emp.clockOutTime).toLocaleTimeString()}</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-200 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                        ✓ Present
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Absent Employees */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Absent Employees</h2>
                <p className="text-sm text-gray-600">{absentToday.length} absent today</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {absentToday.length === 0 ? (
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">All employees are present</p>
                </div>
              ) : (
                absentToday.map((emp) => (
                  <div key={emp._id} className="p-4 border border-red-200 rounded-lg bg-red-50 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-600">{emp.email}</p>
                        <p className="text-xs font-medium text-red-700 mt-1">{emp.employeeId}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-200 text-red-700 rounded-full text-xs font-semibold whitespace-nowrap">
                        ✗ Absent
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Attendance History */}
        {logs.length > 0 && (
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance History</h2>
            <div className="space-y-6">
              {Object.entries(groupLogsByUser()).map(([userId, userData]) => (
                <div key={userId} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="mb-4">
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
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Clock In</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Clock Out</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Duration</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.logs
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .slice(0, 5)
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
                              <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-600">{new Date(log.date).toDateString()}</td>
                                <td className="px-4 py-2 font-medium text-gray-900">{log.clockInTime ? new Date(log.clockInTime).toLocaleTimeString() : '—'}</td>
                                <td className="px-4 py-2 font-medium text-gray-900">{log.clockOutTime ? new Date(log.clockOutTime).toLocaleTimeString() : '—'}</td>
                                <td className="px-4 py-2 font-medium text-gray-900">{duration}</td>
                                <td className="px-4 py-2">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
