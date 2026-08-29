import { useEffect, useState } from 'react';
import { ChevronDown, Trash2, MessageSquare, X } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [editingNotes, setEditingNotes] = useState({});

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const query = filter ? `?status=${filter}` : '';
      const { data } = await api.get(`/custom-requests/admin/all${query}`);
      setRequests(data.requests);
    } catch (error) {
      toast.error('Failed to load requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/custom-requests/admin/${id}/status`, { status: newStatus });
      toast.success('Status updated');
      loadRequests();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const saveNotes = async (id) => {
    try {
      await api.put(`/custom-requests/admin/${id}/notes`, { notes: editingNotes[id] });
      toast.success('Notes saved');
      setEditingNotes({ ...editingNotes, [id]: '' });
      loadRequests();
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/custom-requests/admin/${id}`);
      toast.success('Request deleted');
      loadRequests();
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      reviewing: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="page-title">Custom Gift Requests</h1>
        <div className="mt-4 flex gap-2 flex-wrap">
          {['', 'new', 'reviewing', 'quoted', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                filter === status
                  ? 'bg-burgundy text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading requests...</div>
      ) : (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No requests found</div>
          ) : (
            requests.map((request) => (
              <div key={request._id} className="card-luxe p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">{request.customerName}</p>
                        <p className="text-sm text-slate-500">{request.email} • {request.phone}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-600">
                      {request.occasion} • Budget: PKR {request.budget}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === request._id ? null : request._id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronDown
                      size={20}
                      className={`transition ${expandedId === request._id ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {expandedId === request._id && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Request Details</h3>
                      <p className="text-slate-700">{request.description}</p>
                      {request.referenceImage && (
                        <div className="mt-3">
                          <img
                            src={request.referenceImage}
                            alt="Reference"
                            className="max-w-xs max-h-48 rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <MessageSquare size={18} /> Admin Notes
                        </h3>
                      </div>
                      <textarea
                        value={editingNotes[request._id] || request.notes || ''}
                        onChange={(e) => setEditingNotes({ ...editingNotes, [request._id]: e.target.value })}
                        placeholder="Add internal notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows="3"
                      />
                      {editingNotes[request._id] !== undefined && editingNotes[request._id] !== (request.notes || '') && (
                        <button
                          onClick={() => saveNotes(request._id)}
                          className="mt-2 px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90"
                        >
                          Save Notes
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap items-end">
                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request._id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="quoted">Quoted</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() => deleteRequest(request._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>

                    <div className="text-xs text-slate-400 pt-2">
                      Submitted: {new Date(request.createdAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminCustomRequestsPage;
