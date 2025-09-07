import { useState, useEffect } from "react";
import api from "../../api/client";

export const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setCategories(list);
    } catch (error) {
      console.error("Failed to fetch categories:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/categories-stats");
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching stats:", {
          baseURL: api.defaults.baseURL,
          url: "/categories/stats",
          status: err?.response?.status,
          data: err?.response?.data,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        await fetchCategories();
      } else {
        await api.post("/categories", formData);
        await fetchCategories();
      }
      resetForm();
    } catch (err) {
      console.error(
        "Failed to save category:",
        err?.response?.data || err?.message || err
      );
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);
      alert("Xóa danh mục thành công");
      await fetchCategories();
    } catch (err) {
      console.error(
        "Failed to delete category:",
        err?.response?.data || err?.message || err
      );
    }
  };

  const filteredCategories = (categories || []).filter((category) => {
    const name = (category?.name || "").toLowerCase();
    const desc = (category?.description || "").toLowerCase();
    const term = (searchTerm || "").toLowerCase();
    return name.includes(term) || desc.includes(term);
  });

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/50 relative overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
          color === "blue"
            ? "from-blue-400 to-indigo-600"
            : color === "green"
            ? "from-green-400 to-emerald-600"
            : "from-purple-400 to-pink-600"
        }`}
      ></div>

      <div className="flex items-center relative">
        <div
          className={`p-3 rounded-2xl shadow-lg ${
            color === "blue"
              ? "bg-gradient-to-br from-blue-400 to-indigo-600"
              : color === "green"
              ? "bg-gradient-to-br from-green-400 to-emerald-600"
              : "bg-gradient-to-br from-purple-400 to-pink-600"
          } transform group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center">
        <div className="p-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl">
          <div className="w-6 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
        </div>
        <div className="ml-4">
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-28 mb-2"></div>
          <div className="h-6 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
              Quản lý danh mục
            </h1>
            <p className="text-slate-600 mt-1">
              Quản lý các danh mục sách trong hệ thống
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium 
                     hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Thêm danh mục</span>
            </div>
          </button>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Tổng danh mục"
              value={stats.categoriesTotal || 0}
              color="blue"
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Tổng sách"
              value={stats.booksTotal || 0}
              color="green"
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
            />

            <StatCard
              title="Trung bình sách/danh mục"
              value={Number(stats.average).toFixed(2) || 0}
              color="purple"
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            />
          </div>
        )}

        {/* Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 
                       focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                       placeholder-slate-400 text-slate-700 font-medium"
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tên danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Số sách
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl animate-pulse"></div>
                            <div className="ml-4">
                              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-32 mb-2 animate-pulse"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-64 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-20 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-24 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-12 animate-pulse"></div>
                            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-12 animate-pulse"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  : filteredCategories.map((category, index) => (
                      <tr
                        key={
                          category?.id ??
                          category?._id ??
                          `cat-${category?.name ?? "unknown"}-${index}`
                        }
                        className="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-indigo-50/30 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                              <svg
                                className="w-5 h-5 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                {category.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-700 font-medium max-w-xs truncate">
                            {category.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200 shadow-sm">
                            {category.books_count || 0} sách
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                          {new Date(category.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="group/btn p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg 
                                       hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 
                                       shadow-md hover:shadow-lg"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="group/btn p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg 
                                       hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 
                                       shadow-md hover:shadow-lg"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && filteredCategories.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-slate-50/50 to-indigo-50/50">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Không tìm thấy danh mục
              </h3>
              <p className="text-slate-600">
                {searchTerm
                  ? "Không có danh mục nào phù hợp với từ khóa tìm kiếm."
                  : "Bắt đầu bằng cách tạo danh mục đầu tiên."}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={resetForm}
          >
            <div
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-white/50 transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                  {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 
                             focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                             placeholder-slate-400 text-slate-700 font-medium"
                    placeholder="Nhập tên danh mục"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Mô tả *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 
                             focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                             placeholder-slate-400 text-slate-700 font-medium resize-none"
                    placeholder="Nhập mô tả cho danh mục"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                             text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                  >
                    {editingCategory ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
