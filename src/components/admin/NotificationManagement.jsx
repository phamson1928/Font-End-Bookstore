import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaBell, FaTrash, FaPaperPlane, FaTimes } from "react-icons/fa";
import { api } from "../../api";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Lỗi khi tải thông báo");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification({
      ...newNotification,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newNotification.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung thông báo";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post("/notifications", newNotification);
      toast.success("Đã gửi thông báo thành công");
      setShowModal(false);
      setNewNotification({ message: "" });
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Có lỗi xảy ra khi gửi thông báo");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      try {
        await api.delete(`/notifications/${id}`);
        toast.success("Đã xóa thông báo");
        fetchNotifications();
      } catch (error) {
        console.error("Error deleting notification:", error);
        toast.error("Có lỗi xảy ra khi xóa thông báo");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const resetModal = () => {
    setShowModal(false);
    setNewNotification({ message: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Quản lý thông báo
              </h1>
              <p className="text-slate-600 mt-1">
                Gửi và quản lý thông báo hệ thống
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 
                       shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
            >
              <FaPaperPlane className="mr-2 transition-transform duration-300 group-hover:translate-x-1" />
              Tạo thông báo mới
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "0.8s",
                  }}
                ></div>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-slate-50/50 to-blue-50/50">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaBell className="text-3xl text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Chưa có thông báo nào
              </h3>
              <p className="text-slate-600">
                Tạo thông báo đầu tiên để bắt đầu
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="group p-6 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/30 transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-200">
                          <FaBell className="text-blue-600 text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-800 font-medium leading-relaxed group-hover:text-blue-700 transition-colors duration-200">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-slate-500">
                            <svg
                              className="w-4 h-4 mr-2"
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
                            {formatDate(notification.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="group/btn p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl 
                               transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                      title="Xóa thông báo"
                    >
                      <FaTrash className="transition-transform duration-200 group-hover/btn:scale-110" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetModal();
            }
          }}
        >
          <div
            className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-md p-8 relative shadow-2xl 
                     border border-white/50 transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={resetModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 
                       rounded-xl transition-all duration-200"
            >
              <FaTimes size={20} />
            </button>

            <div className="mb-6">
              <div
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl 
                            flex items-center justify-center mb-4 shadow-lg"
              >
                <FaPaperPlane className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Tạo thông báo mới
              </h2>
              <p className="text-slate-600 mt-1">
                Gửi thông báo đến tất cả người dùng
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Nội dung thông báo <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={newNotification.message}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 
                         focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                         placeholder-slate-400 text-slate-700 font-medium resize-none shadow-sm hover:shadow-md
                         ${
                           errors.message
                             ? "border-red-500 focus:ring-red-100 focus:border-red-500"
                             : "border-slate-200"
                         }`}
                placeholder="Nhập nội dung thông báo..."
              ></textarea>
              {errors.message && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={resetModal}
                className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-semibold
                         hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                         text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <FaPaperPlane className="mr-2" />
                Gửi thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
