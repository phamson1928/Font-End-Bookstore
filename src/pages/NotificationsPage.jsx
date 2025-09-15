import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import { Header } from "../components/user/Header";
import { Footer } from "../components/user/Footer";
import { api } from "../api";

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + " năm trước";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " tháng trước";
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " ngày trước";
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " giờ trước";
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " phút trước";
  }

  return "Vừa xong";
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications/user");
        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Không thể tải thông báo. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      if (!id) {
        await api.put("/notifications/user/markAllAsRead");
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        return;
      }

      await api.put(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/50">
            {/* Enhanced Header */}
            <div
              className="px-8 py-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-slate-200/50 
                          sm:flex sm:items-center sm:justify-between"
            >
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <BellIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                    Thông báo của bạn
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">
                    Cập nhật mới nhất từ hệ thống
                  </p>
                </div>
              </div>
              <div className="mt-6 sm:mt-0">
                <button
                  onClick={() => markAsRead()}
                  className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                           hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl 
                           shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110"
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
                  Đánh dấu tất cả đã đọc
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-slate-200/50">
              {loading ? (
                <div className="px-8 py-16 text-center">
                  <div className="relative inline-flex">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div
                      className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "0.8s",
                      }}
                    ></div>
                  </div>
                  <p className="mt-4 text-lg font-medium text-slate-600">
                    Đang tải thông báo...
                  </p>
                </div>
              ) : error ? (
                <div className="px-8 py-16 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-red-600 font-semibold text-lg mb-3">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                             text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    Thử lại
                  </button>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`px-8 py-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 
                              transition-all duration-300 cursor-pointer group ${
                                !notification.read
                                  ? "bg-gradient-to-r from-blue-50/70 to-indigo-50/50"
                                  : ""
                              }`}
                    onClick={() =>
                      !notification.read && markAsRead(notification.id)
                    }
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <div
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300
                                       ${
                                         !notification.read
                                           ? "bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:scale-110"
                                           : "bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-indigo-100"
                                       }`}
                        >
                          <BellIcon
                            className={`h-6 w-6 transition-colors duration-300 ${
                              !notification.read
                                ? "text-white"
                                : "text-slate-500 group-hover:text-blue-600"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p
                              className={`text-sm leading-relaxed transition-colors duration-300 ${
                                !notification.read
                                  ? "font-semibold text-slate-900 group-hover:text-blue-700"
                                  : "text-slate-700 group-hover:text-blue-600"
                              }`}
                            >
                              {notification.type === "admin"
                                ? `THÔNG BÁO MỚI: ${notification.message}`
                                : `THÔNG BÁO HỆ THỐNG: ${notification.message}`}
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
                              {notification.created_at
                                ? formatTimeAgo(notification.created_at)
                                : "Vừa xong"}
                            </div>
                          </div>

                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <span
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                                             bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 
                                             border border-blue-200 shadow-sm animate-pulse"
                              >
                                Mới
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-20 text-center bg-gradient-to-br from-slate-50/50 to-blue-50/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <BellIcon className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Không có thông báo
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                    Bạn chưa có thông báo nào. Chúng tôi sẽ thông báo cho bạn
                    khi có cập nhật mới.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
