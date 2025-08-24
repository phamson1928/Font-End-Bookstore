import { useState, useEffect } from "react";
import api from "../../api/client";

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    state: "",
    address: "",
    // deliveryDate: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
      window.alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/orders/${editingOrder.id}`, formData);
      // Cập nhật danh sách đơn hàng tại chỗ để phản ánh thay đổi ngay
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id
            ? { ...o, state: formData.state, address: formData.address }
            : o
        )
      );
      // Đóng modal sau khi cập nhật thành công
      resetForm();
    } catch (err) {
      console.error(
        "Error updating order:",
        err?.response?.data || err?.message || err
      );
      // Thông báo lỗi để người dùng biết
      const msg =
        (err?.response?.data &&
          (err.response.data.message || JSON.stringify(err.response.data))) ||
        err?.message ||
        "Cập nhật đơn hàng thất bại";
      window.alert(msg);
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
    // Prefill form với dữ liệu hiện tại của đơn hàng để tránh required bị trống
    setFormData({
      state: order?.state || "Chờ xác nhận",
      address: order?.address || "",
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
        return "bg-green-100 text-green-800";
      case "Đang xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "Chờ xác nhận":
        return "bg-blue-100 text-blue-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-black text-xl font-semibold">Đang tải...</p>
      </div>
    );
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setEditingOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
        <p className="text-gray-600">Theo dõi và quản lý tất cả đơn hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.orderTotal || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã giao</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.deliveredOrder || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingOrder || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng doanh thu
              </p>
              <p className="text-2xl font-bold text-gray-900">
                đ{Number(stats.totalRevenue || 0).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách đơn hàng
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders &&
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || order.customer}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || order.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {order.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {(order.order_items || []).map((order_item) => (
                          <div key={order_item.id} className="mb-1">
                            {order_item.book?.title} x{order_item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {Number(order.total_cost ?? 0).toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.state
                        )}`}
                      >
                        {order.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenEdit(order)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Cập nhật
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Order Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Cập nhật đơn hàng {editingOrder?.id}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Order Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Thông tin đơn hàng
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Khách hàng:</span>{" "}
                  {editingOrder?.user?.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {editingOrder?.user?.email}
                </p>
                <p>
                  <span className="font-medium">Điện thoại:</span>{" "}
                  {editingOrder?.phone}
                </p>
                <p>
                  <span className="font-medium">Tổng tiền:</span>{" "}
                  {Number(editingOrder?.total_cost ?? 0).toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </p>
                <div>
                  <span className="font-medium">Sản phẩm:</span>
                  <ul className="ml-4 mt-1">
                    {editingOrder?.order_items?.map((item, index) => (
                      <li key={index}>
                        • {item.book?.title} x{item.quantity} -{" "}
                        {Number(item.price).toLocaleString("vi-VN")}đ
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái đơn hàng
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ giao hàng
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ giao hàng"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày giao hàng (tùy chọn)
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition duration-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
