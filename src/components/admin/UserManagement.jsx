import React, { useState, useEffect } from "react";
import api from "../../api/client";
import dayjs from "dayjs";
import Swal from "sweetalert2";
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
  BarChart3,
} from "lucide-react";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

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
    
    // Auto-refresh mỗi 30 giây để cập nhật trạng thái
    const refreshInterval = setInterval(() => {
      fetchUsers();
    }, 30 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const handleDeleteClick = async (user) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      html: `Bạn có chắc chắn muốn xóa người dùng<br><strong>${user.name}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/user-delete/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));

      Swal.fire({
        title: "Đã xóa!",
        text: "Người dùng đã được xóa thành công.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(
        "Error deleting user:",
        err?.response?.data || err?.message || err
      );
      Swal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi xóa người dùng.",
        icon: "error",
      });
    }
  };

  const getRoleColor = (role) => {
    return role === "admin"
      ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300"
      : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
  };

  const getStatusColor = (last_seen) => {
    if (!last_seen) return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300";
    
    const lastSeenTime = new Date(last_seen.replace(' ', 'T') + (last_seen.includes('Z') ? '' : 'Z'));
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isOnline = lastSeenTime > fiveMinutesAgo;
    
    return isOnline
      ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-300"
      : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300";
  };

  const getStatusText = (last_seen) => {
    if (!last_seen) return "Offline";
    
    // Sửa timezone issue: thêm 'Z' để parse đúng UTC hoặc dùng local time
    const lastSeenTime = new Date(last_seen.replace(' ', 'T') + (last_seen.includes('Z') ? '' : 'Z'));
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isOnline = lastSeenTime > fiveMinutesAgo;
    
    return isOnline ? "Online" : "Offline";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-64 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-96 animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 animate-pulse"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl">
                    <div className="w-5 h-5 bg-slate-300 rounded"></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-slate-300 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <div className="h-6 bg-slate-200 rounded w-48 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-100 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Compact Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
            Quản lý người dùng
          </h2>
          <p className="text-slate-600">
            Quản lý tài khoản người dùng và phân quyền
          </p>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Tổng người dùng
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {stats.userUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Đang hoạt động
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {stats.onlineUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Quản trị viên
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {stats.adminUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Mới hôm nay
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {stats.newUsers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Users className="mr-2" size={20} />
                Danh sách người dùng
              </h3>
              <span className="text-sm text-slate-600 bg-white px-3 py-1 rounded-full border">
                {users.length} người dùng
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Tham gia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Lần cuối đăng nhập
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/30 transition-all duration-200 group"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <span className="text-xs font-bold text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {user.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 font-medium">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full shadow-sm ${getRoleColor(
                          user.role
                        )}`}
                      >
                        <Shield size={10} className="mr-1" />
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusColor(
                          user.last_seen
                        )}`}
                      >
                        <Activity size={10} className="mr-1" />
                        {getStatusText(user.last_seen)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 font-medium">
                        {dayjs(user.created_at).add(7, 'hour').format("DD/MM/YY")}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 font-medium">
                        {user.last_login_at ? dayjs(user.last_login_at).add(7, 'hour').format("DD/MM/YY HH:mm") : "Chưa đăng nhập"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        className="flex items-center px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 size={12} className="mr-1" />
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
