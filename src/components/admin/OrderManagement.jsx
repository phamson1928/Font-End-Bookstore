import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/client";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  X,
  User,
  Phone,
  MapPin,
} from "lucide-react";

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [formData, setFormData] = useState({
    state: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        const sortedOrders = [...res.data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [orders.state, orders.address]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/orders-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [orders]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      console.error(
        "Error deleting order:",
        err?.response?.data || err?.message || err
      );
      const msg =
        (err?.response?.data &&
          (err.response.data.message || JSON.stringify(err.response.data))) ||
        err?.message ||
        "Xóa đơn hàng thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/orders/${editingOrder.id}`, formData);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id
            ? { 
                ...o, 
                state: formData.state, 
                address: formData.address,
                phone: formData.phone 
              }
            : o
        )
      );
      resetForm();
    } catch (err) {
      console.error(
        "Error updating order:",
        err?.response?.data || err?.message || err
      );
      const msg =
        (err?.response?.data &&
          (err.response.data.message || JSON.stringify(err.response.data))) ||
        err?.message ||
        "Cập nhật đơn hàng thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingOrder(null);
    setShowModal(false);
  };

  const handleOpenEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      state: order?.state || "Chờ xác nhận",
      address: order?.address || "",
      phone: order?.phone || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-100 text-green-800 border-green-200";
      case "Đang xử lý":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Đang vận chuyển":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Đã hủy":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setEditingOrder(null);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="h-full flex flex-col max-w-full">
        {/* Compact Header */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Quản lý đơn hàng
              </h2>
              <p className="text-sm text-gray-600">
                Theo dõi và quản lý đơn hàng
              </p>
            </div>
            <button
              onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isStatsCollapsed ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronUp size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Stats */}
        {!isStatsCollapsed && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 shadow-sm border animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                  <div className="flex items-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Tổng đơn</p>
                      <p className="text-lg font-bold text-gray-900">
                        {stats.orderTotal || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Đã giao</p>
                      <p className="text-lg font-bold text-gray-900">
                        {stats.deliveredOrder || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100">
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Chờ xác nhận</p>
                      <p className="text-lg font-bold text-gray-900">
                        {stats.pendingOrder || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Doanh thu</p>
                      <p className="text-sm font-bold text-gray-900">
                        {Number(stats.totalRevenue || 0).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Compact Orders List */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <ShoppingBag className="mr-2" size={18} />
              Danh sách đơn hàng ({orders.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900">
                          #{order.id}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                            order.state
                          )}`}
                        >
                          {order.state}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.id ? null : order.id
                            )
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedOrder === order.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(order)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div className="flex items-center text-gray-600">
                        <User size={14} className="mr-1" />
                        <span className="truncate">
                          {order.user?.name || order.customer}
                        </span>
                      </div>
                      <div className="text-right font-bold text-gray-900">
                        {Number(order.total_cost ?? 0).toLocaleString("vi-VN")}đ
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="mt-3 pt-3 border-t bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="flex items-center text-gray-600 mb-1">
                              <User size={14} className="mr-1" />
                              <span>{order.user?.email || order.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-1">
                              <Phone size={14} className="mr-1" />
                              <span>{order.phone}</span>
                            </div>
                            <div className="flex items-start text-gray-600 mb-2">
                              <MapPin
                                size={14}
                                className="mr-1 mt-0.5 flex-shrink-0"
                              />
                              <span className="text-xs">{order.address}</span>
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700 mb-1">
                              Sản phẩm:
                            </p>
                            <div className="space-y-1">
                              {order.order_items
                                .slice(0, 2)
                                .map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs text-gray-600 bg-white rounded px-2 py-1"
                                  >
                                    {item.book.title} x{item.quantity}
                                  </div>
                                ))}
                              {order.order_items.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{order.order_items.length - 2} sản phẩm khác
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t flex justify-between items-center text-xs text-gray-500">
                          <span>Thanh toán: {order.payment_method}</span>
                          <span>
                            {new Date(order.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compact Update Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
          >
            <div
              className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                  Cập nhật đơn hàng #{editingOrder?.id}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Thông tin đơn hàng
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Khách hàng:</span>{" "}
                      {editingOrder?.user?.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {editingOrder?.user?.email}
                    </p>
                    <p>
                      <span className="font-medium">Tổng tiền:</span>
                      <span className="font-bold text-blue-600 ml-1">
                        {Number(editingOrder?.total_cost ?? 0).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </span>
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đang vận chuyển">Đang vận chuyển</option>
                      <option value="Đã giao">Đã giao</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ giao hàng
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Nhập địa chỉ giao hàng"
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Cập nhật
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
