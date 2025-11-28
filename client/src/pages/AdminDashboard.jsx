import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/stats/admin');
      setStats(res.data);
    } catch (err) {
      setStats(null);
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={fetchStats} className="px-3 py-1 border rounded">Refresh</button>
          <button onClick={() => navigate('/admin/leaves')} className="px-3 py-1 bg-green-600 text-white rounded">Review Leaves</button>
        </div>
      </div>

      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Pending Leaves</div>
          <div className="text-2xl font-bold">{stats?.pendingLeavesCount ?? 0}</div>
        </div>

        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Absent Today</div>
          <div className="text-2xl font-bold">{stats?.absentToday ? stats.absentToday.length : 0}</div>
        </div>

        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Snapshot</div>
          <div className="text-sm text-gray-700">Quick actions: review leaves, check attendance logs</div>
        </div>
      </div>

      <section>
        <h3 className="text-lg font-medium mb-2">Absent Employees Today</h3>
        {(!stats?.absentToday || stats.absentToday.length === 0) ? (
          <p className="text-sm text-gray-500">No absentees detected today.</p>
        ) : (
          <ul className="space-y-2">
            {stats.absentToday.map((e) => (
              <li key={e._id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.email}</div>
                  <div className="text-sm text-gray-500">{e._id}</div>
                </div>
                <div className="text-sm text-gray-600">—</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
