import { useEffect, useState } from 'react';
import { CheckCircle, Trash2, Star } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReviews();
  }, [filter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/reviews/admin/all');
      if (filter === 'pending') {
        setReviews(data.filter((r) => !r.isApproved));
      } else if (filter === 'approved') {
        setReviews(data.filter((r) => r.isApproved));
      } else {
        setReviews(data);
      }
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id) => {
    try {
      await api.put(`/reviews/admin/${id}/approve`);
      toast.success('Review approved');
      loadReviews();
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      toast.success('Review deleted');
      loadReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="page-title">Reviews Management</h1>
        <div className="mt-4 flex gap-2">
          {['all', 'pending', 'approved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                filter === status
                  ? 'bg-burgundy text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading reviews...</div>
      ) : (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No reviews found</div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="card-luxe p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-slate-800">{review.user?.name}</p>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'fill-gold text-gold' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {review.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">
                      Product: <span className="font-medium">{review.product?.name}</span>
                    </p>
                    <p className="text-slate-700">{review.comment}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {!review.isApproved && (
                      <button
                        onClick={() => approveReview(review._id)}
                        className="p-2 hover:bg-green-100 rounded-lg text-green-600"
                        title="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminReviewsPage;
