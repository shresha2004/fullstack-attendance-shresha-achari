import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get('/stats/me');
      setStats(res.data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const handleClockIn = async () => {
    await api.post('/attendance/clock-in');
    alert('Clocked in');
  };

  const handleClockOut = async () => {
    await api.post('/attendance/clock-out');
    alert('Clocked out');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <p>Days worked this month: {stats.daysWorkedThisMonth}</p>
      <p>Approved leaves this month: {stats.approvedLeavesThisMonth}</p>

      <button onClick={handleClockIn}>Clock In</button>
      <button onClick={handleClockOut}>Clock Out</button>

      <button onClick={() => navigate('/employee/attendance')}>View Attendance</button>
      <button onClick={() => navigate('/employee/leaves')}>Leaves</button>
    </div>
  );
};

export default EmployeeDashboard;
