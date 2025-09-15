import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { api } from "../../api";

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

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  // Only count unread system notifications for the bell counter
  const unreadCount = notifications.filter(
    (n) => !n.read && n.type === "system"
  ).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/user");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/user/markAllAsRead");
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      alert("Không thể đánh dấu tất cả thông báo là đã đọc. Vui lòng thử lại.");
    }
  };

  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button
          className="group p-3 rounded-xl text-slate-600 hover:text-blue-600 bg-white/70 hover:bg-blue-50 
                   backdrop-blur-sm border border-white/50 hover:border-blue-200
                   focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
                   transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 relative"
        >
          <BellIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full 
                           bg-gradient-to-r from-red-500 to-pink-600 text-xs font-bold text-white shadow-lg 
                           animate-pulse border-2 border-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95 translate-y-2"
        enterTo="transform opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100 translate-y-0"
        leaveTo="transform opacity-0 scale-95 translate-y-2"
      >
        <Menu.Items
          className="absolute right-0 mt-3 w-96 origin-top-right bg-white/95 backdrop-blur-md shadow-2xl 
                   border border-white/50 rounded-2xl focus:outline-none z-50 max-h-[32rem] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-3">
                  <BellIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Thông báo</h3>
                {unreadCount > 0 && (
                  <span
                    className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 
                                 text-blue-800 text-xs font-bold rounded-full border border-blue-200"
                  >
                    {unreadCount} mới
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 
                           hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.slice(0, 8).map((notification, index) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <div
                      className={`px-6 py-4 cursor-pointer transition-all duration-200 border-b border-slate-100/50 last:border-b-0
                                ${
                                  active
                                    ? "bg-gradient-to-r from-blue-50/50 to-indigo-50/30"
                                    : ""
                                } 
                                ${
                                  !notification.read
                                    ? "bg-gradient-to-r from-blue-50/70 to-indigo-50/50"
                                    : ""
                                }`}
                      onClick={() =>
                        !notification.read && markAsRead(notification.id)
                      }
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 transition-all duration-200
                                       ${
                                         !notification.read
                                           ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                                           : "bg-slate-300"
                                       }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-relaxed transition-colors duration-200 ${
                              !notification.read
                                ? "font-semibold text-slate-900"
                                : "text-slate-700"
                            }`}
                          >
                            <span
                              className={`inline-block px-2 py-1 rounded-lg text-xs font-bold mr-2 
                                           ${
                                             !notification.read
                                               ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
                                               : "bg-slate-100 text-slate-600"
                                           }`}
                            >
                              THÔNG BÁO
                            </span>
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-slate-500">
                            <svg
                              className="w-3 h-3 mr-1"
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
                      </div>
                    </div>
                  )}
                </Menu.Item>
              ))
            ) : (
              <div className="px-6 py-12 text-center bg-gradient-to-br from-slate-50/50 to-blue-50/50">
                <div
                  className="w-16 h-16 bg-gradient-to-br from-slate-200 to-blue-200 rounded-2xl 
                              flex items-center justify-center mx-auto mb-4"
                >
                  <BellIcon className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Không có thông báo mới
                </p>
                <p className="text-xs text-slate-500">
                  Chúng tôi sẽ thông báo khi có cập nhật
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 px-6 py-3 border-t border-slate-200/50">
            <Link
              to="/thong-bao"
              className="group flex items-center justify-center text-sm font-semibold text-blue-600 
                       hover:text-blue-800 py-2 px-4 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              Xem tất cả thông báo
            </Link>
          </div>
        </Menu.Items>
      </Transition>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
    </Menu>
  );
};

export default NotificationBell;
