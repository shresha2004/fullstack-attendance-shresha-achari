import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosClient';
import { PageSpinner, Spinner } from '../components/Spinner';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaves?status=Pending');
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

  const updateStatus = async (id, status) => {
    setActioningId(id);
    try {
      await api.patch(`/leaves/${id}/status`, { status });
      toast.success(`Leave ${status.toLowerCase()} successfully!`);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update leave');
    } finally {
      setActioningId(null);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Pending Leave Requests</h1>
        <p className="text-gray-600 mb-8">Review and approve/reject employee leave applications</p>

        {leaves.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium text-lg">No pending leave requests</p>
            <p className="text-gray-500 text-sm mt-1">All leave applications have been reviewed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {leaves.map((l) => (
              <div key={l._id} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Employee</p>
                    <p className="text-lg font-semibold text-gray-900">{l.user?.name || l.user?.email}</p>
                    <p className="text-sm text-gray-500">{l.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(l.startDate).toDateString()} to {new Date(l.endDate).toDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {Math.ceil((new Date(l.endDate) - new Date(l.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 font-medium mb-2">Reason</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{l.reason}</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => updateStatus(l._id, 'Approved')}
                    disabled={actioningId === l._id}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actioningId === l._id ? (
                      <>
                        <Spinner size="sm" className="text-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Approve
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => updateStatus(l._id, 'Rejected')}
                    disabled={actioningId === l._id}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {actioningId === l._id ? (
                      <>
                        <Spinner size="sm" className="text-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeaves;
