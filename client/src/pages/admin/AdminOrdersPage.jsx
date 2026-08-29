import { useEffect, useState } from 'react';
import { ChevronDown, Truck, CheckCircle, Trash2 } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [filter, page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const query = filter ? `?status=${filter}&page=${page}` : `?page=${page}`;
      const { data } = await api.get(`/orders/admin/all${query}`);
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/admin/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const markDelivered = async (orderId) => {
    try {
      await api.put(`/orders/admin/${orderId}/mark-delivered`);
      toast.success('Order marked as delivered');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/orders/admin/${orderId}`);
      toast.success('Order deleted');
      loadOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="page-title">Orders Management</h1>
        <div className="mt-4 flex gap-2 flex-wrap">
          {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => { setFilter(status); setPage(1); }}
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
        <div className="text-center py-12">Loading orders...</div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No orders found</div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="card-luxe p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">Order #{order._id.slice(-8)}</p>
                        <p className="text-sm text-slate-500">{order.user?.name} • {order.user?.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-600">
                      PKR {order.totalPrice.toFixed(2)} • {order.orderItems?.length} items
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronDown
                      size={20}
                      className={`transition ${expandedOrder === order._id ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {expandedOrder === order._id && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Items</h3>
                      <div className="space-y-1 text-sm">
                        {order.orderItems?.map((item, idx) => (
                          <p key={idx} className="text-slate-600">
                            {item.name} x {item.quantity} @ PKR {item.price}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-slate-700">Shipping Address</p>
                        <p className="text-slate-600 mt-1">
                          {order.shippingAddress?.fullName}<br />
                          {order.shippingAddress?.address}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.country}<br />
                          {order.shippingAddress?.phone}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700">Price Breakdown</p>
                        <p className="text-slate-600 mt-1">
                          Items: PKR {order.itemsPrice}<br />
                          Shipping: PKR {order.shippingPrice}<br />
                          Tax: PKR {order.taxPrice}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => markDelivered(order._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <CheckCircle size={16} /> Mark Delivered
                        </button>
                      )}

                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
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

export default AdminOrdersPage;
