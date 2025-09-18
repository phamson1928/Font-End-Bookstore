import React, { useState, useEffect } from "react";
import { api } from "../../api";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import {
  Bell,
  Tag,
  Plus,
  Edit,
  Trash2,
  Users,
  Percent,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";

const SystemManagement = () => {
  const [activeTab, setActiveTab] = useState("discounts");

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [notificationForm, setNotificationForm] = useState({
    message: "",
    user_id: "",
  });

  // Discounts state
  const [discounts, setDiscounts] = useState([]);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [discountForm, setDiscountForm] = useState({
    discount_percent: "",
    active: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "notifications") {
      fetchNotifications();
    } else {
      fetchDiscounts();
    }
  }, [activeTab]);

  // Notification functions
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications/admin");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Lỗi khi tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingNotification) {
        await api.put(
          `/notifications/admin/${editingNotification.id}`,
          notificationForm
        );
        toast.success("Cập nhật thông báo thành công");
      } else {
        await api.post("/notifications/admin", notificationForm);
        toast.success("Tạo thông báo thành công");
      }
      resetNotificationForm();
      fetchNotifications();
    } catch (error) {
      console.error("Error saving notification:", error);
      toast.error("Lỗi khi lưu thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa thông báo này?',
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
      setLoading(true);
      await api.delete(`/notifications/admin/${id}`);
      fetchNotifications();
      
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Thông báo đã được xóa thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Lỗi khi xóa thông báo.',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetNotificationForm = () => {
    setNotificationForm({ message: "", user_id: "" });
    setEditingNotification(null);
    setShowNotificationForm(false);
  };

  // Discount functions
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/discounts");
      setDiscounts(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      toast.error("Lỗi khi tải danh sách giảm giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingDiscount) {
        await api.put(`/discounts/${editingDiscount.id}`, discountForm);
        toast.success("Cập nhật giảm giá thành công");
      } else {
        await api.post("/discounts", discountForm);
        toast.success("Tạo giảm giá thành công");
      }
      resetDiscountForm();
      fetchDiscounts();
    } catch (error) {
      console.error("Error saving discount:", error);
      toast.error("Lỗi khi lưu giảm giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (id) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa giảm giá này?',
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
      setLoading(true);
      await api.delete(`/discounts/${id}`);
      fetchDiscounts();
      
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Giảm giá đã được xóa thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error deleting discount:", error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Lỗi khi xóa giảm giá.',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetDiscountForm = () => {
    setDiscountForm({ discount_percent: "", active: false });
    setEditingDiscount(null);
    setShowDiscountForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            Quản lý hệ thống
          </h1>
          <p className="text-slate-600 text-lg">
            Quản lý thông báo và chương trình giảm giá của hệ thống
          </p>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8">
          <div className="flex p-2">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "notifications"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105"
                  : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 hover:shadow-md"
              }`}
            >
              <Bell
                className={`w-5 h-5 mr-3 ${
                  activeTab === "notifications" ? "animate-pulse" : ""
                }`}
              />
              Quản lý thông báo
            </button>
            <button
              onClick={() => setActiveTab("discounts")}
              className={`flex-1 flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "discounts"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 transform scale-105"
                  : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 hover:shadow-md"
              }`}
            >
              <Tag
                className={`w-5 h-5 mr-3 ${
                  activeTab === "discounts" ? "animate-pulse" : ""
                }`}
              />
              Quản lý giảm giá
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {activeTab === "notifications" ? (
            <div className="p-8">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Thông báo hệ thống
                  </h2>
                  <p className="text-slate-600">
                    Quản lý và gửi thông báo đến người dùng
                  </p>
                </div>
                <button
                  onClick={() => setShowNotificationForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Thêm thông báo
                </button>
              </div>

              {/* Enhanced Notification Form */}
              {showNotificationForm && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200/50 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">
                      {editingNotification
                        ? "Chỉnh sửa thông báo"
                        : "Tạo thông báo mới"}
                    </h3>
                    <button
                      onClick={resetNotificationForm}
                      className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-white/50 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Nội dung thông báo
                      </label>
                      <textarea
                        value={notificationForm.message}
                        onChange={(e) =>
                          setNotificationForm({
                            ...notificationForm,
                            message: e.target.value,
                          })
                        }
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none bg-white/80"
                        rows="4"
                        placeholder="Nhập nội dung thông báo tại đây..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        <Users className="w-4 h-4 inline mr-2" />
                        User ID (để trống để gửi cho tất cả)
                      </label>
                      <input
                        type="number"
                        value={notificationForm.user_id}
                        onChange={(e) =>
                          setNotificationForm({
                            ...notificationForm,
                            user_id: e.target.value,
                          })
                        }
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                        placeholder="Nhập ID người dùng cụ thể..."
                      />
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={handleNotificationSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Đang lưu...
                          </div>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                            {editingNotification ? "Cập nhật" : "Tạo mới"}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={resetNotificationForm}
                        className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Notifications List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-600">
                      Đang tải danh sách thông báo...
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                    <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg font-medium">
                      Chưa có thông báo nào
                    </p>
                    <p className="text-slate-500">
                      Nhấn "Thêm thông báo" để tạo thông báo đầu tiên
                    </p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className="bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-blue-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-slate-800 font-medium leading-relaxed mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="font-medium">
                                {notification.user_id
                                  ? `User ID: ${notification.user_id}`
                                  : "Tất cả người dùng"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-slate-400" />
                              <span>
                                {new Date(
                                  notification.created_at
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => {
                              setEditingNotification(notification);
                              setNotificationForm({
                                message: notification.message,
                                user_id: notification.user_id || "",
                              });
                              setShowNotificationForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-8">
              {/* Discounts Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Chương trình giảm giá
                  </h2>
                  <p className="text-slate-600">
                    Quản lý các chương trình khuyến mại và giảm giá
                  </p>
                </div>
                <button
                  onClick={() => setShowDiscountForm(true)}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Thêm giảm giá
                </button>
              </div>

              {/* Enhanced Discount Form */}
              {showDiscountForm && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 mb-8 border border-emerald-200/50 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">
                      {editingDiscount
                        ? "Chỉnh sửa giảm giá"
                        : "Tạo chương trình giảm giá mới"}
                    </h3>
                    <button
                      onClick={resetDiscountForm}
                      className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-white/50 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        <Percent className="w-4 h-4 inline mr-2" />
                        Phần trăm giảm giá (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={discountForm.discount_percent}
                        onChange={(e) =>
                          setDiscountForm({
                            ...discountForm,
                            discount_percent: e.target.value,
                          })
                        }
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80"
                        placeholder="Nhập phần trăm giảm giá (0-100)"
                        required
                      />
                    </div>
                    <div className="flex items-center bg-white/60 rounded-xl p-4 border border-emerald-200">
                      <input
                        type="checkbox"
                        id="active"
                        checked={discountForm.active}
                        onChange={(e) =>
                          setDiscountForm({
                            ...discountForm,
                            active: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500 mr-4"
                      />
                      <label
                        htmlFor="active"
                        className="text-sm font-semibold text-slate-700 flex items-center"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                        Kích hoạt ngay
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Chỉ 1 giảm giá được kích hoạt
                        </span>
                      </label>
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={handleDiscountSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Đang lưu...
                          </div>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                            {editingDiscount ? "Cập nhật" : "Tạo mới"}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={resetDiscountForm}
                        className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Discounts Table */}
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-600">
                      Đang tải danh sách giảm giá...
                    </p>
                  </div>
                ) : discounts.length === 0 ? (
                  <div className="text-center py-16">
                    <Tag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg font-medium">
                      Chưa có chương trình giảm giá nào
                    </p>
                    <p className="text-slate-500">
                      Nhấn "Thêm giảm giá" để tạo chương trình đầu tiên
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                      <tr>
                        <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                          Phần trăm giảm
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {discounts.map((discount, index) => (
                        <tr
                          key={discount.id}
                          className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 group"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-900">
                            #{discount.id}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center text-lg font-bold text-emerald-600">
                              <Percent className="w-5 h-5 mr-2" />
                              {discount.discount_percent}%
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full ${
                                discount.active
                                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                                  : "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300"
                              }`}
                            >
                              {discount.active ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Đang hoạt động
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  Không hoạt động
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={() => {
                                  setEditingDiscount(discount);
                                  setDiscountForm({
                                    discount_percent: discount.discount_percent,
                                    active: discount.active,
                                  });
                                  setShowDiscountForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all duration-300 hover:scale-110"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteDiscount(discount.id)
                                }
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-all duration-300 hover:scale-110"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemManagement;
