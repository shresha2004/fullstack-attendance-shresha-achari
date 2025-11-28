import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/leaves?status=Pending');
      setLeaves(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    setError('');
    try {
      await api.patch(`/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Pending Leave Requests</h2>
      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : leaves.length === 0 ? (
        <p className="text-sm text-gray-500">No pending leaves.</p>
      ) : (
        <ul className="space-y-3">
          {leaves.map((l) => (
            <li key={l._id} className="p-3 border rounded">
              <div className="text-sm">Employee: {l.user?.email}</div>
              <div className="text-sm">From: {new Date(l.startDate).toDateString()}</div>
              <div className="text-sm">To: {new Date(l.endDate).toDateString()}</div>
              <div className="text-sm">Reason: {l.reason}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => updateStatus(l._id, 'Approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                <button onClick={() => updateStatus(l._id, 'Rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminLeaves;
