import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/leaves/me');
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

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!startDate || !endDate || !reason) return setError('Please fill all fields');
    try {
      await api.post('/leaves', { startDate, endDate, reason });
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || 'Apply failed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Apply For Leave</h2>
      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}
      <form onSubmit={submit} className="mb-6 space-y-3 max-w-md">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Reason</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Apply</button>
      </form>

      <h3 className="text-lg font-medium mb-2">My Leave Requests</h3>
      {loading ? (
        <p>Loading...</p>
      ) : leaves.length === 0 ? (
        <p className="text-sm text-gray-500">No leave requests yet.</p>
      ) : (
        <ul className="space-y-2">
          {leaves.map((l) => (
            <li key={l._id} className="p-3 border rounded">
              <div><strong>{new Date(l.startDate).toDateString()}</strong> — {new Date(l.endDate).toDateString()}</div>
              <div className="text-sm">Reason: {l.reason}</div>
              <div className="text-sm">Status: {l.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeLeaves;
