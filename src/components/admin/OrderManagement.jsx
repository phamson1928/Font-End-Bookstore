import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/client";
import Swal from "sweetalert2";
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
  Package,
  Calendar,
  CreditCard,
  Tag,
  TrendingUp,
  TicketPlusIcon,
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
    payment_status: "",
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
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order.id !== id));

      Swal.fire({
        title: "Đã xóa!",
        text: "Đơn hàng đã được xóa thành công.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
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
      Swal.fire({
        title: "Lỗi!",
        text: msg,
        icon: "error",
      });
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
                phone: formData.phone,
                payment_status: formData.payment_status,
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
      payment_status: order?.payment_status || "Chưa thanh toán",
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
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 shadow-sm";
      case "Đang xử lý":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200 shadow-sm";
      case "Đang vận chuyển":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm";
      case "Đã hủy":
        return "bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border border-rose-200 shadow-sm";
      default:
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border border-slate-200 shadow-sm";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Đã giao":
        return <CheckCircle size={12} className="mr-1" />;
      case "Đã xác nhận":
        return <TicketPlusIcon size={12} className="mr-1" />;
      case "Đang vận chuyển":
        return <Package size={12} className="mr-1" />;
      case "Đã hủy":
        return <X size={12} className="mr-1" />;
      default:
        return <Clock size={12} className="mr-1" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 shadow-sm";
      case "Chưa thanh toán":
        return "bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border border-rose-200 shadow-sm";
      default:
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border border-slate-200 shadow-sm";
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "Đã thanh toán":
        return <CheckCircle size={12} className="mr-1" />;
      case "Chưa thanh toán":
        return <X size={12} className="mr-1" />;
      default:
        return <CreditCard size={12} className="mr-1" />;
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setEditingOrder(null);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="h-full flex flex-col max-w-full">
        {/* Elegant Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Quản lý đơn hàng
                </h2>
                <p className="text-slate-600 mt-1">
                  Theo dõi và quản lý đơn hàng một cách hiệu quả
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
              className="p-3 hover:bg-white/60 rounded-xl transition-all duration-200 group"
            >
              {isStatsCollapsed ? (
                <ChevronDown
                  size={20}
                  className="text-slate-600 group-hover:text-blue-600"
                />
              ) : (
                <ChevronUp
                  size={20}
                  className="text-slate-600 group-hover:text-blue-600"
                />
              )}
            </button>
          </div>
        </div>

        {/* Elegant Stats Cards */}
        {!isStatsCollapsed && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 animate-pulse"
                >
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full mb-3"></div>
                  <div className="h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full w-3/4"></div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Tổng đơn hàng
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.orderTotal || 0}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-emerald-200 transition-all duration-300">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <Package className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Đã giao
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.deliveredOrder || 0}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg group-hover:shadow-amber-200 transition-all duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <Calendar className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Chờ xác nhận
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.pendingOrder || 0}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-200 transition-all duration-300">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <CreditCard className="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Doanh thu
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {Number(stats.totalRevenue || 0).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Elegant Orders List */}
        <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Package
                className="mr-3 p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white"
                size={32}
              />
              Danh sách đơn hàng
              <span className="ml-3 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                {orders.length}
              </span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/60 rounded-xl border border-slate-200/50 p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full mb-3"></div>
                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-3/4 mb-2"></div>
                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-200/30">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl border border-slate-300 shadow-sm">
                          <span className="font-bold text-slate-800 text-lg">
                            #{order.id}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-xl ${getStatusColor(
                              order.state
                            )}`}
                          >
                            {getStatusIcon(order.state)}
                            {order.state}
                          </span>
                          <span
                            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-xl ${getPaymentStatusColor(
                              order.payment_status
                            )}`}
                          >
                            {getPaymentStatusIcon(order.payment_status)}
                            {order.payment_status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.id ? null : order.id
                            )
                          }
                          className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200"
                        >
                          {expandedOrder === order.id ? (
                            <ChevronUp size={18} className="text-slate-600" />
                          ) : (
                            <ChevronDown size={18} className="text-slate-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-sm mb-3">
                      <div className="flex items-center text-slate-600">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-3">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <span className="truncate font-medium">
                          {order.user?.name || order.customer}
                        </span>
                      </div>
                      <div className="text-center">
                        {order.discount ? (
                          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-xl border border-emerald-200 shadow-sm">
                            <Tag size={14} className="mr-1" />-
                            {(() => {
                              const originalPrice =
                                Number(order.total_cost) +
                                Number(order.discount);
                              const percentage = Math.round(
                                (Number(order.discount) / originalPrice) * 100
                              );
                              return percentage;
                            })()}
                            %
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 font-medium">
                            Không có giảm giá
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                          {Number(
                            order.total ?? order.total_cost ?? 0
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200/50">
                        <div className="bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-xl p-4 border border-slate-200/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-3">
                              <div className="flex items-center text-slate-600">
                                <div className="p-1.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-3">
                                  <User size={14} className="text-blue-600" />
                                </div>
                                <span className="font-medium">
                                  {order.user?.email || order.email}
                                </span>
                              </div>
                              <div className="flex items-center text-slate-600">
                                <div className="p-1.5 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3">
                                  <Phone size={14} className="text-green-600" />
                                </div>
                                <span className="font-medium">
                                  {order.phone}
                                </span>
                              </div>
                              <div className="flex items-start text-slate-600">
                                <div className="p-1.5 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mr-3 mt-0.5">
                                  <MapPin
                                    size={14}
                                    className="text-purple-600"
                                  />
                                </div>
                                <span className="text-sm font-medium leading-relaxed">
                                  {order.address}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              {order.discount && (
                                <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                                  <div className="flex items-center mb-2">
                                    <Tag className="w-4 h-4 text-emerald-600 mr-2" />
                                    <p className="text-sm font-bold text-emerald-700">
                                      Giảm giá áp dụng:
                                    </p>
                                  </div>
                                  <div className="text-sm text-emerald-600 font-medium">
                                    -
                                    {Math.round(
                                      (order.discount /
                                        (Number(order.total_cost) +
                                          Number(order.discount))) *
                                        100
                                    )}
                                    % (
                                    {Number(order.discount).toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ)
                                  </div>
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-slate-700 mb-2 flex items-center">
                                  <Package size={16} className="mr-2" />
                                  Sản phẩm:
                                </p>
                                <div className="space-y-2">
                                  {order.order_items
                                    .slice(0, 2)
                                    .map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="text-sm text-slate-600 bg-white/60 rounded-lg px-3 py-2 border border-slate-200/50"
                                      >
                                        <span className="font-medium">
                                          {item.book.title}
                                        </span>
                                        <span className="mx-2 text-blue-600 font-bold">
                                          ×{item.quantity}
                                        </span>
                                      </div>
                                    ))}
                                  {order.order_items.length > 2 && (
                                    <div className="text-sm text-slate-500 font-medium bg-slate-100/50 rounded-lg px-3 py-2">
                                      +{order.order_items.length - 2} sản phẩm
                                      khác
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-200/50 flex justify-between items-center text-sm">
                            <div className="flex items-center text-slate-600">
                              <CreditCard size={16} className="mr-2" />
                              <span className="font-medium">
                                Thanh toán: {order.payment_method} -
                                <span
                                  className={`font-bold ${
                                    order.payment_status === "Đã thanh toán"
                                      ? "text-emerald-600"
                                      : order.payment_status ===
                                        "Chưa thanh toán"
                                      ? "text-rose-600"
                                      : "text-amber-600"
                                  }`}
                                >
                                  {order.payment_status}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <Calendar size={16} className="mr-2" />
                              <span className="font-medium">
                                {new Date(order.created_at).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Elegant Update Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-6"
            onClick={handleBackdropClick}
          >
            <div
              className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Cập nhật đơn hàng #{editingOrder?.id}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200"
                  >
                    <X size={24} className="text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-xl p-4 border border-slate-200/30">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                    <Package size={20} className="mr-2" />
                    Thông tin đơn hàng
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <User size={16} className="mr-2 text-blue-600" />
                        <span className="font-medium text-slate-600">
                          Khách hàng:
                        </span>
                        <span className="ml-2 font-semibold">
                          {editingOrder?.user?.name}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium text-slate-600">
                          Email:
                        </span>
                        <span className="ml-2 font-semibold">
                          {editingOrder?.user?.email}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      {editingOrder?.discount && (
                        <p className="flex items-center">
                          <Tag size={16} className="mr-2 text-emerald-600" />
                          <span className="font-medium text-slate-600">
                            Giảm giá:
                          </span>
                          <span className="ml-2 text-emerald-600 font-bold">
                            -
                            {Math.round(
                              (editingOrder.discount /
                                (Number(editingOrder.total_cost) +
                                  Number(editingOrder.discount))) *
                                100
                            )}
                            % (
                            {Number(editingOrder.discount).toLocaleString(
                              "vi-VN"
                            )}
                            đ)
                          </span>
                        </p>
                      )}
                      <p className="flex items-center">
                        <DollarSign
                          size={16}
                          className="mr-2 text-purple-600"
                        />
                        <span className="font-medium text-slate-600">
                          Tổng tiền:
                        </span>
                        <span className="ml-2 font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {Number(
                            editingOrder?.total ?? editingOrder?.total_cost ?? 0
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Trạng thái đơn hàng
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-700 font-medium"
                      >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đang vận chuyển">Đang vận chuyển</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Đã giao">Đã giao</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Trạng thái thanh toán
                      </label>
                      <select
                        name="payment_status"
                        value={formData.payment_status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-700 font-medium"
                      >
                        <option value="Chưa thanh toán">Chưa thanh toán</option>
                        <option value="Đã thanh toán">Đã thanh toán</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-700 font-medium"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Địa chỉ giao hàng
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-700 font-medium resize-none"
                      placeholder="Nhập địa chỉ giao hàng chi tiết"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Cập nhật đơn hàng
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Hủy bỏ
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
