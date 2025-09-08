import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import { Header } from "../components/user/Header";
import { Footer } from "../components/user/Footer";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Đơn hàng #1234 đã được giao",
      time: "2 phút trước",
      read: false,
    },
    {
      id: 2,
      message: "Khuyến mãi mới: Giảm 20% tất cả sách",
      time: "1 giờ trước",
      read: true,
    },
    {
      id: 3,
      message: "Đơn hàng #1233 đang được vận chuyển",
      time: "3 giờ trước",
      read: true,
    },
    {
      id: 4,
      message: "Đánh giá sản phẩm của bạn đã được duyệt",
      time: "1 ngày trước",
      read: true,
    },
    {
      id: 5,
      message: "Cập nhật thông tin tài khoản thành công",
      time: "2 ngày trước",
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    if (!id) {
      // Mark all as read
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      return;
    }
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center">
                <BellIcon className="h-8 w-8 text-blue-600" />
                <h1 className="ml-3 text-2xl font-semibold text-gray-900">
                  Thông báo của bạn
                </h1>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => markAsRead()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-200">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() =>
                      !notification.read && markAsRead(notification.id)
                    }
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <BellIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p
                          className={`text-sm ${
                            !notification.read
                              ? "font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Mới
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Không có thông báo
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bạn chưa có thông báo nào.
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
