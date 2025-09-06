import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import api from "../../api/client";

const OrderChangeRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseText, setResponseText] = useState("");

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

  const getStatusBadge = (status) => {
    const statusClasses = {
      "Đang chờ": "bg-yellow-100 text-yellow-800",
      "Hoàn thành": "bg-green-100 text-green-800",
      "Đã từ chối": "bg-red-100 text-red-800",
    };

    const statusText = {
      "Đang chờ": "Đang chờ",
      "Hoàn thành": "Hoàn thành",
      "Đã từ chối": "Đã từ chối",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusClasses[status] || "bg-gray-100"
        }`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          {/* Header Skeleton */}
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          
          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(4)].map((_, i) => (
                    <th key={i} className="px-6 py-3 text-left">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        Danh sách yêu cầu thay đổi thông tin đơn hàng
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người yêu cầu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày yêu cầu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không có yêu cầu nào
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    #{request.order_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.user?.name || "Không xác định"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(request.created_at), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold mb-4">Chi tiết yêu cầu</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
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
                  <h3 className="text-sm font-medium text-gray-500">
                    Mã đơn hàng
                  </h3>
                  <p className="mt-1">#{selectedRequest.order_id}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Người yêu cầu
                  </h3>
                  <p className="mt-1">
                    {selectedRequest.user?.name} ({selectedRequest.user?.email})
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Nội dung yêu cầu
                  </h3>
                  <p className="mt-1 bg-gray-50 p-3 rounded">
                    {selectedRequest.note}
                  </p>
                </div>

                {selectedRequest.status === "Đang chờ" && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Phản hồi
                    </h3>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 h-24"
                      placeholder="Nhập phản hồi của bạn..."
                    />
                  </div>
                )}

                {selectedRequest.status === "Đang chờ" ? (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => handleReject(selectedRequest.order_id)}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                    >
                      Từ chối
                    </button>
                    <button
                      onClick={() => handleApprove(selectedRequest.order_id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Chấp nhận
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Phản hồi của quản trị viên
                    </h3>
                    <p className="mt-1 bg-gray-50 p-3 rounded">
                      {selectedRequest.admin_response || "Không có phản hồi"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderChangeRequestManagement;
