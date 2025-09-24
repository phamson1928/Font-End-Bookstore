import React, { useState, useEffect } from "react";
import { Footer } from "../components/user/Footer";
import { Header } from "../components/user/Header";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
  Trash2,
  ChevronDown,
  ChevronUp,
  Banknote,
  Receipt,
  Search,
  Filter,
  X,
  Send,
  MessageCircle,
  CheckCircle2,
  Loader2,
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
  const [adminResponses, setAdminResponses] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await api.get("/orders");

        let ordersData = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
        ordersData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

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
        gradient: "from-amber-500 to-yellow-500",
        shadow: "shadow-amber-500/20",
      },
      "Đang vận chuyển": {
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: Truck,
        label: "Đang vận chuyển",
        dotColor: "bg-blue-400",
        gradient: "from-blue-500 to-indigo-500",
        shadow: "shadow-blue-500/20",
      },
      "Đã giao": {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: CheckCircle,
        label: "Đã giao hàng",
        dotColor: "bg-green-400",
        gradient: "from-green-500 to-emerald-500",
        shadow: "shadow-green-500/20",
      },
      "Đã hủy": {
        bg: "bg-gradient-to-r from-red-50 to-pink-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: XCircle,
        label: "Đã hủy",
        dotColor: "bg-red-400",
        gradient: "from-red-500 to-pink-500",
        shadow: "shadow-red-500/20",
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
        gradient: "from-gray-500 to-slate-500",
        shadow: "shadow-gray-500/20",
      }
    );
  };

  const StatusBadge = ({ state }) => {
    const { icon: Icon, label, gradient, shadow } = getStatusConfig(state);

    return (
      <div
        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${gradient} text-white ${shadow} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
      >
        <div
          className={`w-2 h-2 bg-white rounded-full mr-2 animate-pulse`}
        ></div>
        <Icon size={14} className="mr-2" />
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
    if (order.state === "Đã giao" || order.state === "Đã hủy") {
      toast.error("Đơn hàng này không thể thay đổi thông tin!");
      return;
    }
    setCurrentOrder(order);
    setShowRequestModal(true);
  };

  const handleDeleteOrder = async (order) => {
    if (
      order.payment_status !== "Chưa thanh toán" ||
      order.state !== "Chờ xác nhận"
    ) {
      toast.error(
        "Chỉ có thể xóa đơn hàng chưa thanh toán và đang chờ xác nhận!"
      );
      return;
    }

    const result = await Swal.fire({
      title: 'Xác nhận hủy đơn hàng',
      html: `Bạn có chắc chắn muốn hủy đơn hàng <strong>#${order.id}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Hủy đơn hàng',
      cancelButtonText: 'Giữ lại'
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/orders/${order.id}`);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      await Swal.fire({
        title: 'Đã hủy!',
        text: 'Đơn hàng đã được hủy thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi xóa đơn hàng";
      toast.error(errorMessage);
    }
  };

  const submitRequest = async () => {
    if (!requestNote.trim()) {
      toast.info("Vui lòng nhập nội dung yêu cầu");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(
        `/orders/${currentOrder.id}/change-requests`,
        {
          note: requestNote,
          order_id: currentOrder.id,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        "Đã gửi yêu cầu thay đổi thông tin đơn hàng thành công!",
        response.data.message
      );
      setShowRequestModal(false);
      setRequestNote("");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      console.log("Full error response:", error.response);
      if (error.response?.status === 422) {
        const errors = error.response.data.errors || {};
        const firstError =
          Object.values(errors)[0]?.[0] || "Dữ liệu không hợp lệ";
        toast.error(`Lỗi: ${firstError}`);
      } else if (error.response?.status === 403) {
        if (error.response?.data?.message === "Unauthenticated.") {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        toast.error("Bạn không có quyền thực hiện hành động này.");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOrderExpand = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(orderId);

    // Only fetch if we haven't fetched before
    if (!adminResponses[orderId] && adminResponses[orderId] !== null) {
      try {
        console.log(`Fetching admin response for order ${orderId}`);
        const response = await api.get(`/orders/${orderId}/change-requests`);

        if (response.data && response.data.admin_response) {
          setAdminResponses((prev) => ({
            ...prev,
            [orderId]: response.data.admin_response,
          }));
        } else {
          // Store null to prevent refetching
          setAdminResponses((prev) => ({
            ...prev,
            [orderId]: null,
          }));
        }
      } catch (error) {
        console.error("Error fetching admin response for order", orderId, ":", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        // Store null to prevent refetching
        setAdminResponses((prev) => ({
          ...prev,
          [orderId]: null,
        }));
      }
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.phone.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || order.state === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Group filtered orders by status
  const groupedOrders = {
    "Chờ xác nhận": filteredOrders.filter(
      (order) => order.state === "Chờ xác nhận"
    ),
    "Đang vận chuyển": filteredOrders.filter(
      (order) => order.state === "Đang vận chuyển"
    ),
    "Đã giao": filteredOrders.filter((order) => order.state === "Đã giao"),
    "Đã hủy": filteredOrders.filter((order) => order.state === "Đã hủy"),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Loading Header */}
          <div className="mb-8">
            <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl w-80 mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded-xl w-96 animate-pulse"></div>
          </div>

          {/* Loading Cards */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-pulse"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div>
                      <div className="h-6 bg-slate-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-slate-200 rounded-full w-28"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-4 border border-white/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Đã xảy ra lỗi
            </h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                Lịch sử đơn hàng
              </h1>
              <p className="text-slate-600 text-lg">
                Theo dõi trạng thái và quản lý đơn hàng của bạn
              </p>
              <div className="flex items-center mt-3 space-x-4 text-sm text-slate-500">
                <span className="flex items-center">
                  <Receipt className="w-4 h-4 mr-1" />
                  {orders.length} đơn hàng
                </span>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 appearance-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đang vận chuyển">Đang vận chuyển</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-16 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              {searchTerm || selectedStatus !== "all"
                ? "Không tìm thấy đơn hàng"
                : "Chưa có đơn hàng nào"}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedStatus !== "all"
                ? "Không có đơn hàng nào phù hợp với bộ lọc của bạn."
                : "Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!"}
            </p>
            {!searchTerm && selectedStatus === "all" && (
              <a
                href="/"
                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Mua sắm ngay
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedOrders).map(([status, statusOrders]) => {
              if (statusOrders.length === 0) return null;

              const statusConfig = getStatusConfig(status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={status}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                >
                  {/* Enhanced Status Header */}
                  <div
                    className={`bg-gradient-to-r ${statusConfig.gradient} p-6 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg mr-4">
                          <StatusIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {statusConfig.label}
                          </h2>
                          <p className="text-white/80 font-medium">
                            {statusOrders.length} đơn hàng
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Orders List */}
                  <div className="divide-y divide-slate-200">
                    {statusOrders.map((order, index) => (
                      <div
                        key={order.id}
                        className="p-6 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-4 shadow-lg">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800 text-lg">
                                Đơn hàng #{order.id}
                              </h3>
                              <div className="flex items-center text-sm text-slate-600 mt-1">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(order.created_at)}
                              </div>
                              <StatusBadge state={order.state} />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600 mb-2">
                              {formatCurrency(order.total_cost || order.total)}
                            </p>
                            <button
                              onClick={() => toggleOrderExpand(order.id)}
                              className="group flex items-center text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {expandedOrder === order.id
                                ? "Ẩn chi tiết"
                                : "Xem chi tiết"}
                              {expandedOrder === order.id ? (
                                <ChevronUp className="w-4 h-4 ml-1 group-hover:-translate-y-0.5 transition-transform" />
                              ) : (
                                <ChevronDown className="w-4 h-4 ml-1 group-hover:translate-y-0.5 transition-transform" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Enhanced Order Details */}
                        {expandedOrder === order.id && (
                          <div className="mt-6 pt-6 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Order Info */}
                              <div className="space-y-6">
                                <h4 className="font-bold text-slate-800 text-lg flex items-center mb-4">
                                  <Receipt className="w-5 h-5 mr-2 text-blue-600" />
                                  Thông tin đơn hàng
                                </h4>

                                <div className="space-y-4">
                                  <div className="flex items-center p-3 bg-white/60 rounded-xl">
                                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                                    <div>
                                      <span className="text-slate-600 text-sm">
                                        Số điện thoại
                                      </span>
                                      <p className="font-semibold text-slate-800">
                                        {order.phone}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start p-3 bg-white/60 rounded-xl">
                                    <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                                    <div>
                                      <span className="text-slate-600 text-sm">
                                        Địa chỉ giao hàng
                                      </span>
                                      <p className="font-semibold text-slate-800 leading-relaxed">
                                        {order.address}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center p-3 bg-white/60 rounded-xl">
                                    {order.payment_method === "cod" ? (
                                      <Banknote className="w-5 h-5 text-blue-600 mr-3" />
                                    ) : (
                                      <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                                    )}
                                    <div>
                                      <span className="text-slate-600 text-sm">
                                        Phương thức thanh toán
                                      </span>
                                      <p className="font-semibold text-slate-800">
                                        {order.payment_method === "cod"
                                          ? "Thanh toán khi nhận hàng"
                                          : order.payment_method === "zalopay"
                                          ? "ZaloPay"
                                          : order.payment_method}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Actions & Status */}
                              <div className="space-y-6">
                                <h4 className="font-bold text-slate-800 text-lg flex items-center mb-4">
                                  <CheckCircle2 className="w-5 h-5 mr-2 text-blue-600" />
                                  Trạng thái & Hành động
                                </h4>

                                <div className="bg-white/60 rounded-xl p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-slate-600 font-medium">
                                      Trạng thái thanh toán
                                    </span>
                                    <div
                                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                        order.payment_status === "Đã thanh toán"
                                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                          : "bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                                      } shadow-lg`}
                                    >
                                      {order.payment_status ||
                                        "Chưa thanh toán"}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  {order.state !== "Đã giao" &&
                                    order.state !== "Đã hủy" && (
                                      <button
                                        onClick={() =>
                                          handleRequestChange(order)
                                        }
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                                      >
                                        <Edit2 className="w-5 h-5 mr-2" />
                                        Yêu cầu thay đổi thông tin
                                      </button>
                                    )}

                                  {order.payment_status === "Chưa thanh toán" &&
                                    order.state === "Chờ xác nhận" && (
                                      <button
                                        onClick={() => handleDeleteOrder(order)}
                                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                                      >
                                        <Trash2 className="w-5 h-5 mr-2" />
                                        Hủy đơn hàng
                                      </button>
                                    )}
                                </div>

                                {adminResponses[order.id] && (
                                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg">
                                    <div className="flex items-center mb-3">
                                      <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
                                      <h4 className="font-bold text-blue-800">
                                        Phản hồi từ Admin
                                      </h4>
                                    </div>
                                    <p className="text-blue-700 leading-relaxed">
                                      {adminResponses[order.id]}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* Enhanced Request Change Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-lg border border-white/20">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Yêu cầu thay đổi thông tin
                  </h3>
                  <p className="text-blue-100 mt-1">
                    Đơn hàng #{currentOrder?.id}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestNote("");
                  }}
                  className="text-white hover:text-blue-200 p-2 rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-blue-600" />
                  Nội dung yêu cầu thay đổi
                </label>
                <textarea
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="Ví dụ: Tôi muốn thay đổi địa chỉ giao hàng thành..."
                  className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-300 bg-slate-50 hover:bg-white"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">
                    Tối đa 500 ký tự
                  </span>
                  <span className="text-xs text-slate-400">
                    {requestNote.length}/500
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">
                      Lưu ý quan trọng
                    </h4>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      Yêu cầu thay đổi sẽ được gửi đến bộ phận xử lý đơn hàng.
                      Thời gian phản hồi từ 1-2 giờ làm việc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex space-x-3">
              <button
                onClick={submitRequest}
                disabled={isSubmitting || !requestNote.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl disabled:hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Gửi yêu cầu
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestNote("");
                }}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-800 py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryOrder;
