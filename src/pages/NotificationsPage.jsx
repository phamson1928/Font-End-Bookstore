import React, { useState, useEffect } from "react";
import { api } from "../api";
import { Header } from "../components/user/Header";
import { Footer } from "../components/user/Footer";
import {
  Bell,
  Settings,
  CheckCheck,
  AlertCircle,
  Search,
  Clock,
  Sparkles,
  Mail,
  Star,
  Loader2,
  CheckCircle2,
  Shield,
  Zap,
} from "lucide-react";

const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

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
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [markingAsRead, setMarkingAsRead] = useState(false);

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

  const filterNotifications = (type, isRead = null) => {
    return notifications.filter((n) => {
      const typeMatch = type === "all" || n.type === type;
      const readMatch = isRead === null || n.is_read === isRead;
      const searchMatch =
        searchTerm === "" ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && readMatch && searchMatch;
    });
  };

  const getTypeConfig = (type) => {
    const configs = {
      admin: {
        gradient: "from-purple-500 to-pink-500",
        bgLight: "bg-purple-50",
        textColor: "text-purple-700",
        badgeBg: "bg-purple-100",
        icon: Shield,
        label: "Quản trị",
      },
      system: {
        gradient: "from-green-500 to-emerald-500",
        bgLight: "bg-green-50",
        textColor: "text-green-700",
        badgeBg: "bg-green-100",
        icon: Settings,
        label: "Hệ thống",
      },
      promotion: {
        gradient: "from-yellow-500 to-orange-500",
        bgLight: "bg-yellow-50",
        textColor: "text-yellow-700",
        badgeBg: "bg-yellow-100",
        icon: Star,
        label: "Khuyến mại",
      },
      update: {
        gradient: "from-indigo-500 to-blue-500",
        bgLight: "bg-indigo-50",
        textColor: "text-indigo-700",
        badgeBg: "bg-indigo-100",
        icon: Zap,
        label: "Cập nhật",
      },
      default: {
        gradient: "from-slate-500 to-gray-500",
        bgLight: "bg-slate-50",
        textColor: "text-slate-700",
        badgeBg: "bg-slate-100",
        icon: Bell,
        label: "Thông báo",
      },
    };

    return configs[type] || configs.default;
  };

  const markAsRead = async (id = null) => {
    setMarkingAsRead(true);
    try {
      if (!id) {
        await api.put("/notifications/user/markAllAsRead");
        setNotifications(notifications.map((n) => ({ ...n, is_read: 1 })));
      } else {
        await api.put(`/notifications/${id}/read`);
        setNotifications(
          notifications.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setMarkingAsRead(false);
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return filterNotifications("all", 0);
      case "admin":
        return filterNotifications("admin");
      case "system":
        return filterNotifications("system");
      default:
        return notifications.filter(
          (n) =>
            searchTerm === "" ||
            n.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
  };

  const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                  Thông báo
                </h1>
                <p className="text-slate-600 text-lg">
                  {unreadCount > 0
                    ? `Bạn có ${unreadCount} thông báo chưa đọc`
                    : "Tất cả thông báo đã được đọc"}
                </p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-slate-500">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {notifications.length} thông báo
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                />
              </div>

              <button
                onClick={() => markAsRead()}
                disabled={markingAsRead || unreadCount === 0}
                className="group inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
              >
                {markingAsRead ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Đánh dấu tất cả đã đọc
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Filter Tabs */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              {
                key: "all",
                label: "Tất cả",
                count: notifications.filter(
                  (n) =>
                    searchTerm === "" ||
                    n.message.toLowerCase().includes(searchTerm.toLowerCase())
                ).length,
                icon: Bell,
              },
              {
                key: "unread",
                label: "Chưa đọc",
                count: filterNotifications("all", 0).length,
                icon: Mail,
              },
              {
                key: "admin",
                label: "Quản trị",
                count: filterNotifications("admin").length,
                icon: Shield,
              },
              {
                key: "system",
                label: "Hệ thống",
                count: filterNotifications("system").length,
                icon: Settings,
              },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/60 hover:bg-white/80 text-slate-700 hover:shadow-md"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-bold ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="relative inline-flex">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-xl font-semibold text-slate-700">
                Đang tải thông báo...
              </p>
              <p className="text-slate-500 mt-2">Vui lòng chờ trong giây lát</p>
            </div>
          ) : error ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Đã xảy ra lỗi
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Thử lại
              </button>
            </div>
          ) : (
            (() => {
              const filteredNotifications = getFilteredNotifications();

              return filteredNotifications.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {filteredNotifications.map((notification, index) => {
                    const typeConfig = getTypeConfig(notification.type);
                    const IconComponent = typeConfig.icon;

                    return (
                      <div
                        key={notification.id}
                        className={`p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 
                                transition-all duration-300 cursor-pointer group ${
                                  notification.is_read === 0
                                    ? "bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border-l-4 border-blue-500"
                                    : ""
                                }`}
                        onClick={() =>
                          notification.is_read === 0 &&
                          markAsRead(notification.id)
                        }
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Enhanced Icon */}
                          <div className="flex-shrink-0 pt-1">
                            <div
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 ${
                                notification.is_read === 0
                                  ? `bg-gradient-to-br ${typeConfig.gradient}`
                                  : "bg-gradient-to-br from-slate-100 to-slate-200"
                              }`}
                            >
                              <IconComponent
                                className={`w-6 h-6 transition-colors duration-300 ${
                                  notification.is_read === 0
                                    ? "text-white"
                                    : "text-slate-500"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span
                                    className={`px-3 py-1 text-xs font-bold rounded-full ${typeConfig.badgeBg} ${typeConfig.textColor}`}
                                  >
                                    {typeConfig.label}
                                  </span>
                                  {notification.is_read === 0 && (
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                      <span className="text-xs font-semibold text-blue-600">
                                        Chưa đọc
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <p
                                  className={`leading-relaxed transition-colors duration-300 ${
                                    notification.is_read === 0
                                      ? "text-slate-800 font-medium text-base"
                                      : "text-slate-600"
                                  }`}
                                >
                                  {notification.message}
                                </p>
                              </div>

                              {/* Time and Actions */}
                              <div className="flex-shrink-0 text-right">
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                  <Clock className="w-3 h-3" />
                                  {formatTimeAgo(notification.created_at)}
                                </div>

                                <div className="flex items-center gap-2">
                                  {notification.is_read === 0 ? (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-sm">
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      Mới
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Đã đọc
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {activeTab === "unread" ? (
                      <CheckCircle2 className="w-10 h-10 text-slate-400" />
                    ) : (
                      <Bell className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {searchTerm
                      ? "Không tìm thấy thông báo"
                      : activeTab === "unread"
                      ? "Tất cả thông báo đã được đọc"
                      : activeTab === "admin"
                      ? "Không có thông báo quản trị"
                      : activeTab === "system"
                      ? "Không có thông báo hệ thống"
                      : "Chưa có thông báo nào"}
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    {searchTerm
                      ? `Không có thông báo nào chứa "${searchTerm}"`
                      : activeTab === "unread"
                      ? "Bạn đã đọc tất cả thông báo. Tuyệt vời!"
                      : activeTab === "all"
                      ? "Bạn sẽ nhận được thông báo khi có cập nhật mới từ hệ thống"
                      : "Thử chuyển sang tab khác để xem thêm thông báo"}
                  </p>
                </div>
              );
            })()
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
