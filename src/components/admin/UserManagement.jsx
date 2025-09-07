import React, { useState, useEffect } from "react";
import api from "../../api/client";
import dayjs from "dayjs";
import {
  Users,
  UserCheck,
  Shield,
  Clock,
  Trash2,
  X,
  User,
  Mail,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users-stats");
        setStats(res.data);
      } catch (err) {
        console.error(
          "Error fetching stats:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user-index");
        setUsers(res.data);
      } catch (err) {
        console.error(
          "Error fetching users:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (!userToDelete?.id) {
      console.warn("No user selected for deletion");
      return;
    }
    try {
      const response = await api.delete(`/user-delete/${userToDelete.id}`);
      console.log(response?.data?.message || "User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error(
        "Error deleting user:",
        err?.response?.data || err?.message || err
      );
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const getRoleColor = (role) => {
    return role === "admin"
      ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300"
      : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
  };

  const getStatusColor = (last_seen) => {
    return last_seen
      ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-300"
      : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300";
  };

  const LoadingSkeleton = () => (
    <div className="flex gap-4 h-screen overflow-hidden">
      {/* Stats Section Skeleton */}
      <div
        className={`transition-all duration-300 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 ${
          isStatsCollapsed ? "w-16" : "w-80"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className={`${isStatsCollapsed ? "hidden" : "block"}`}>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            </div>
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className={`space-y-4 ${isStatsCollapsed ? "hidden" : "block"}`}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-12 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section Skeleton */}
      <div className="flex-1 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Quản lý người dùng
        </h2>
        <p className="text-gray-600 text-lg">
          Quản lý tài khoản người dùng và phân quyền
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)] overflow-hidden">
        {/* Stats Section - Collapsible */}
        <div
          className={`transition-all duration-300 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 ${
            isStatsCollapsed ? "w-20" : "w-80"
          }`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className={`${isStatsCollapsed ? "hidden" : "block"}`}>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  Thống kê
                </h3>
              </div>
              <button
                onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                {isStatsCollapsed ? (
                  <ChevronRight size={20} className="text-gray-600" />
                ) : (
                  <ChevronLeft size={20} className="text-gray-600" />
                )}
              </button>
            </div>

            {/* Collapsed Stats Icons */}
            {isStatsCollapsed ? (
              <div className="space-y-4">
                <div
                  className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center"
                  title="Tổng người dùng"
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div
                  className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg flex items-center justify-center"
                  title="Đang hoạt động"
                >
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div
                  className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center"
                  title="Quản trị viên"
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div
                  className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg flex items-center justify-center"
                  title="Mới hôm nay"
                >
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            ) : (
              /* Expanded Stats Cards */
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Tổng người dùng
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.userUsers}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-lg border border-emerald-100 p-4 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Đang hoạt động
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.onlineUsers}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 p-4 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Quản trị viên
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.adminUsers}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg border border-amber-100 p-4 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Mới hôm nay
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.newUsers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table Section */}
        <div className="flex-1 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="mr-3" size={24} />
                Danh sách người dùng
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                  {users.length} người dùng
                </span>
                <button
                  onClick={() => setIsTableCollapsed(!isTableCollapsed)}
                  className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200"
                  title={isTableCollapsed ? "Mở rộng bảng" : "Thu gọn bảng"}
                >
                  {isTableCollapsed ? (
                    <ChevronRight size={20} className="text-gray-600" />
                  ) : (
                    <ChevronLeft size={20} className="text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isTableCollapsed ? (
              /* Collapsed Table View - Compact Cards */
              <div className="p-6 space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-bold text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Expanded Table View */
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thông tin liên hệ
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Ngày tham gia
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Đăng nhập cuối
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-sm font-bold text-white">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 flex items-center">
                                <User
                                  size={14}
                                  className="mr-2 text-gray-400"
                                />
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail size={14} className="mr-2 text-gray-400" />
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${getRoleColor(
                              user.role
                            )}`}
                          >
                            <Shield size={12} className="mr-1" />
                            {user.role === "admin"
                              ? "Quản trị viên"
                              : "Khách hàng"}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(
                              user.last_seen
                            )}`}
                          >
                            <Activity size={12} className="mr-1" />
                            {user.last_seen
                              ? "Đang hoạt động"
                              : "Không hoạt động"}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar
                              size={14}
                              className="mr-2 text-gray-400"
                            />
                            {dayjs(user.created_at).format("DD/MM/YYYY")}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock size={14} className="mr-2 text-gray-400" />
                            {user.last_login_at == null
                              ? "Chưa đăng nhập lại"
                              : dayjs(user.last_login_at).format("DD/MM/YYYY")}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <button
                            className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Trash2 className="mr-3 text-red-600" size={24} />
                Xác nhận xóa người dùng
              </h3>
              <button
                onClick={handleCancelDelete}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-gray-700">
                  Bạn có chắc chắn muốn xóa người dùng
                </p>
                <p className="font-bold text-red-800 mt-1">
                  {userToDelete?.name}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-all duration-200"
                onClick={handleCancelDelete}
              >
                Hủy
              </button>
              <button
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-200 hover:scale-105"
                onClick={handleConfirmDelete}
              >
                Xóa người dùng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
