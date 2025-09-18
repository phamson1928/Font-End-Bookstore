import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import api from "../../api/client";
import Swal from 'sweetalert2';
import {
  Trash2,
  Trash,
  Eye,
  X,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";

const OrderChangeRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOrderChangeRequests();
  }, []);

  const fetchOrderChangeRequests = async () => {
    try {
      const response = await api.get("order-change-requests");
      setRequests(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching order change requests:", error);
      toast.error("Lỗi khi tải yêu cầu thay đổi đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await api.put(`order-change-requests/${orderId}`, {
        status: "Hoàn thành",
        admin_response: responseText,
      });
      toast.success("Đã chấp nhận yêu cầu");
      fetchOrderChangeRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Có lỗi xảy ra khi xử lý yêu cầu");
    }
  };

  const handleReject = async (orderId) => {
    try {
      await api.put(`order-change-requests/${orderId}`, {
        status: "Đã từ chối",
        admin_response: responseText,
      });
      toast.success("Đã từ chối yêu cầu");
      fetchOrderChangeRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Có lỗi xảy ra khi xử lý yêu cầu");
    }
  };

  const handleDelete = async (requestId) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa yêu cầu này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`order-change-requests/${requestId}`);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Yêu cầu đã được xóa thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error deleting request:", error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi xóa yêu cầu.',
        icon: 'error'
      });
    }
  };

  const handleDeleteAll = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa tất cả',
      text: 'Bạn có chắc chắn muốn xóa tất cả yêu cầu? Hành động này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa tất cả',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      setIsDeleting(true);
      await api.delete("order-change-requests/delete-all");
      fetchOrderChangeRequests();
      
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Tất cả yêu cầu đã được xóa thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error deleting all requests:", error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi xóa yêu cầu.',
        icon: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Đang chờ": {
        className:
          "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200",
        icon: Clock,
        text: "Đang chờ",
      },
      "Hoàn thành": {
        className:
          "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200",
        icon: CheckCircle,
        text: "Hoàn thành",
      },
      "Đã từ chối": {
        className:
          "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
        icon: XCircle,
        text: "Đã từ chối",
      },
    };

    const config = statusConfig[status] || {
      className: "bg-gray-100 text-gray-800 border border-gray-200",
      icon: Clock,
      text: status,
    };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-80"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32"></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
              <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded w-3/4"></div>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="px-6 py-5 hover:bg-gray-50">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 rounded w-8"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-8 border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Yêu cầu thay đổi thông tin đơn hàng
          </h2>
          <p className="text-gray-600 text-sm">
            Tổng cộng {requests.length} yêu cầu
          </p>
        </div>

        <button
          onClick={handleDeleteAll}
          disabled={requests.length === 0 || isDeleting}
          className="flex items-center px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-200 hover:shadow-red-300 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 transition-all duration-200"
        >
          <Trash2 size={18} className="mr-2" />
          {isDeleting ? "Đang xóa..." : "Xóa tất cả"}
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Người yêu cầu
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ngày yêu cầu
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FileText size={48} className="mb-4 text-gray-300" />
                      <p className="text-lg font-medium">
                        Không có yêu cầu nào
                      </p>
                      <p className="text-sm">
                        Chưa có yêu cầu thay đổi đơn hàng nào được gửi
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                          #{request.order_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                            <User size={16} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {request.user?.name || "Không xác định"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {format(new Date(request.created_at), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(request.created_at), "HH:mm", {
                          locale: vi,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Xóa yêu cầu"
                        >
                          <Trash size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          <Eye size={16} />
                          <span>Xem chi tiết</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Chi tiết yêu cầu
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Đơn hàng #{selectedRequest.order_id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Order Info */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <User size={16} className="mr-2" />
                      Người yêu cầu
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {selectedRequest.user?.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedRequest.user?.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Calendar size={16} className="mr-2" />
                      Thời gian gửi
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {format(
                        new Date(selectedRequest.created_at),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: vi,
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageSquare size={18} className="mr-2" />
                  Nội dung yêu cầu
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedRequest.note}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái hiện tại
                  </h3>
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              {/* Response Section */}
              {selectedRequest.status === "Đang chờ" ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Phản hồi của bạn
                  </h3>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-4 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="Nhập phản hồi của bạn..."
                  />
                </div>
              ) : (
                selectedRequest.admin_response && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Phản hồi của quản trị viên
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-gray-800 leading-relaxed">
                        {selectedRequest.admin_response || "Không có phản hồi"}
                      </p>
                    </div>
                  </div>
                )
              )}

              {/* Action Buttons */}
              {selectedRequest.status === "Đang chờ" && (
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleReject(selectedRequest.order_id)}
                    className="flex items-center justify-center px-6 py-3 border-2 border-red-500 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-all duration-200 hover:scale-105"
                  >
                    <XCircle size={18} className="mr-2" />
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.order_id)}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-medium shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-200 hover:scale-105"
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Chấp nhận
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderChangeRequestManagement;
