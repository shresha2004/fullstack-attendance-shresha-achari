import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosClient';
import { Spinner, PageSpinner } from '../components/Spinner';

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaves/me');
      setLeaves(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      toast.error('Please fill all fields');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/leaves', { startDate, endDate, reason });
      toast.success('Leave request submitted successfully!');
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Leave Management</h1>
        <p className="text-gray-600 mb-8">Apply for leave and track your requests</p>

        {/* Apply Leave Form */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for Leave</h2>
          <form onSubmit={submit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={submitting}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <textarea 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                placeholder="Enter your reason for leave..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                disabled={submitting}
              />
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </form>
        </div>

        {/* Leave Requests */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Leave Requests</h2>
          {leaves.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No leave requests yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaves.map((l) => (
                <div key={l._id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Start Date</p>
                      <p className="font-semibold text-gray-900">{new Date(l.startDate).toDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      l.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      l.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 font-medium">End Date</p>
                    <p className="font-semibold text-gray-900">{new Date(l.endDate).toDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Reason</p>
                    <p className="text-gray-700 text-sm">{l.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaves;
