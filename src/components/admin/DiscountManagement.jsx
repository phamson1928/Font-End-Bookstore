import React, { useState, useEffect } from "react";
import { api } from "../../api";
import { toast } from "react-toastify";

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formData, setFormData] = useState({
    discount_percent: "",
    active: false,
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingDiscount) {
        await api.put(`/discounts/${editingDiscount.id}`, formData);
        toast.success("Cập nhật giảm giá thành công");
      } else {
        await api.post("/discounts", formData);
        toast.success("Tạo giảm giá thành công");
      }
      
      resetForm();
      fetchDiscounts();
    } catch (error) {
      console.error("Error saving discount:", error);
      toast.error("Lỗi khi lưu giảm giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa giảm giá này?")) return;
    
    try {
      setLoading(true);
      await api.delete(`/discounts/${id}`);
      toast.success("Xóa giảm giá thành công");
      fetchDiscounts();
    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("Lỗi khi xóa giảm giá");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      discount_percent: discount.discount_percent,
      active: discount.active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ discount_percent: "", active: false });
    setEditingDiscount(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý giảm giá</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Thêm giảm giá
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingDiscount ? "Sửa giảm giá" : "Thêm giảm giá mới"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phần trăm giảm giá (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.discount_percent}
                onChange={(e) =>
                  setFormData({ ...formData, discount_percent: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Kích hoạt (chỉ có 1 giảm giá được kích hoạt)
              </label>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : editingDiscount ? "Cập nhật" : "Tạo mới"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Phần trăm giảm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : discounts.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Chưa có giảm giá nào
                </td>
              </tr>
            ) : (
              discounts.map((discount) => (
                <tr key={discount.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {discount.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {discount.discount_percent}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        discount.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {discount.active ? "Đang hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(discount.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountManagement;