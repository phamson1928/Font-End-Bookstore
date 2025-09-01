import React, { useState, useEffect } from "react";
import { Footer } from "../components/user/Footer";
import { Header } from "../components/user/Header";
import {
  Calendar,
  Package,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  ShoppingCart,
  Edit2,
  AlertCircle,
} from "lucide-react";
import { api } from "../api";

const HistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [requestNote, setRequestNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await api.get("/orders");

        // Ensure we're working with an array
        const ordersData = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];

        setOrders(ordersData);
      } catch (err) {
        setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusConfig = (state) => {
    const statusConfig = {
      "Chờ xác nhận": {
        bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: Clock,
        label: "Chờ xác nhận",
        dotColor: "bg-amber-400",
      },
      "Đang vận chuyển": {
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: Truck,
        label: "Đang vận chuyển",
        dotColor: "bg-blue-400",
      },
      "Đã giao": {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: CheckCircle,
        label: "Đã giao hàng",
        dotColor: "bg-green-400",
      },
      "Đã hủy": {
        bg: "bg-gradient-to-r from-red-50 to-pink-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: XCircle,
        label: "Đã hủy",
        dotColor: "bg-red-400",
      },
    };

    return (
      statusConfig[state] || {
        bg: "bg-gradient-to-r from-gray-50 to-slate-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: Package,
        label: "Không xác định",
        dotColor: "bg-gray-400",
      }
    );
  };

  const StatusBadge = ({ state }) => {
    const {
      bg,
      text,
      border,
      icon: Icon,
      label,
      dotColor,
    } = getStatusConfig(state);

    return (
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${bg} ${text} ${border} border shadow-sm`}
      >
        <div
          className={`w-2 h-2 ${dotColor} rounded-full mr-2 animate-pulse`}
        ></div>
        <Icon size={14} className="mr-1.5" />
        {label}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleRequestChange = (order) => {
    setCurrentOrder(order);
    setShowRequestModal(true);
  };

  const submitRequest = async () => {
    if (!requestNote.trim()) {
      alert("Vui lòng nhập nội dung yêu cầu");
      return;
    }

    setIsSubmitting(true);
    try {
      // Gọi API để gửi yêu cầu thay đổi
      await api.post(`/orders/${currentOrder.id}/change-request`, {
        note: requestNote,
        status: "pending",
      });

      alert("Đã gửi yêu cầu thay đổi thông tin đơn hàng thành công!");
      setShowRequestModal(false);
      setRequestNote("");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đã xảy ra lỗi
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Lịch sử đơn hàng
          </h1>
          <p className="text-gray-600 text-lg">
            Theo dõi và quản lý các đơn hàng của bạn
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="text-center py-20 px-8">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Package size={48} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Chưa có đơn hàng nào
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Bạn chưa có đơn hàng nào. Hãy khám phá cửa hàng và tìm kiếm sản
                phẩm yêu thích của bạn!
              </p>
              <button
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => (window.location.href = "/")}
              >
                <ShoppingCart size={18} className="mr-2" />
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg p-3">
                        <Package size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Đơn hàng #{order.id}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <StatusBadge state={order.state} />
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id
                          )
                        }
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Eye size={16} />
                        {expandedOrder === order.id ? "Thu gọn" : "Chi tiết"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Thanh toán</p>
                          <p className="font-semibold text-gray-900">
                            {order.payment_method}
                          </p>
                          <p className="text-xs text-blue-600">
                            {order.payment_status}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Package size={20} className="text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Sản phẩm</p>
                          <p className="font-semibold text-gray-900">
                            {order.order_items?.length || 0} loại
                          </p>
                          <p className="text-xs text-green-600">
                            Tổng số lượng:{" "}
                            {order.order_items?.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-purple-600">₫</div>
                        <div>
                          <p className="text-sm text-gray-600">Tổng tiền</p>
                          <p className="font-bold text-xl text-gray-900">
                            {formatCurrency(order.total_cost)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="space-y-6 border-t border-gray-100 pt-6">
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Mail size={16} />
                          Thông tin khách hàng
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              Họ tên:
                            </span>
                            <span className="text-gray-600">
                              {order.user?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              Email:
                            </span>
                            <span className="text-gray-600">
                              {order.user?.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span className="font-medium text-gray-700">
                              Điện thoại:
                            </span>
                            <span className="text-gray-600">{order.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin size={16} />
                          Địa chỉ giao hàng
                        </h4>
                        <p className="text-gray-600">{order.address}</p>
                      </div>

                      {/* Action Buttons */}
                      {order.state !== "Đã hủy" && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                          <div className="flex items-center">
                            <AlertCircle
                              className="text-yellow-500 mr-2"
                              size={18}
                            />
                            <p className="text-sm text-yellow-700">
                              Cần thay đổi thông tin đơn hàng?
                            </p>
                            <button
                              onClick={() => handleRequestChange(order)}
                              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                            >
                              <Edit2 size={16} className="mr-2" />
                              Yêu cầu thay đổi
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Package size={16} />
                          Danh sách sản phẩm
                        </h4>
                        <div className="space-y-3">
                          {order.order_items?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white rounded-lg p-3 border"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.book?.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Số lượng: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(item.price)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  / sản phẩm
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Change Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Yêu cầu thay đổi đơn hàng
                </h3>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestNote("");
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Đóng</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="requestNote"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nội dung yêu cầu thay đổi
                  </label>
                  <textarea
                    id="requestNote"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Vui lòng mô tả chi tiết thay đổi bạn muốn thực hiện..."
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestModal(false);
                      setRequestNote("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={submitRequest}
                    disabled={isSubmitting}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HistoryOrder;
