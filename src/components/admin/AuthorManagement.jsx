import { useState, useEffect } from "react";
import { api } from "../../api";
import { getImageUrl, getBookPlaceholder } from "../../utils/imageUtils";
import dayjs from "dayjs";
import Swal from 'sweetalert2';

export const AuthorManagement = () => {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [stats, setStats] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Nam",
    image: "",
    description: "",
    nationality: "",
    total_work: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Vui lòng chọn file hình ảnh hợp lệ.',
          icon: 'error'
        });
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'File hình ảnh không được lớn hơn 5MB.',
          icon: 'error'
        });
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isEditing = Boolean(editingAuthor);
      const hasNewImage = formData.image instanceof File;

      if (isEditing && !hasNewImage) {
        const payload = {
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
          description: formData.description,
        };
        if (formData.nationality) payload.nationality = formData.nationality;
        if (formData.total_work !== "")
          payload.total_work = Number(formData.total_work);

        await api.put(`/authors/${editingAuthor.id}`, payload);
      } else {
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("age", String(Number(formData.age)));
        submitData.append("gender", formData.gender);
        submitData.append("description", formData.description);
        if (formData.nationality)
          submitData.append("nationality", formData.nationality);
        if (formData.total_work !== "")
          submitData.append("total_work", String(Number(formData.total_work)));
        if (hasNewImage) {
          submitData.append("image", formData.image);
        }

        if (isEditing && hasNewImage) {
          submitData.append("_method", "PUT");
          await api.post(`/authors/${editingAuthor.id}`, submitData);
        } else if (isEditing) {
          await api.put(`/authors/${editingAuthor.id}`, submitData);
        } else {
          await api.post("/authors", submitData);
        }
      }

      const { data } = await api.get("/authors");
      setAuthors(data);
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting author:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        Swal.fire({
          title: 'Lỗi xác thực!',
          text: errorMessages.join(", "),
          icon: 'error'
        });
      } else if (error.response?.data?.message) {
        Swal.fire({
          title: 'Lỗi!',
          text: error.response.data.message,
          icon: 'error'
        });
      } else {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi gửi form. Vui lòng thử lại.',
          icon: 'error'
        });
      }
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      age: author.age.toString(),
      gender: author.gender,
      image: author.image,
      description: author.description,
      nationality: author.nationality || "",
      total_work:
        typeof author.total_work === "number"
          ? author.total_work.toString()
          : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa tác giả này?',
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
      await api.delete(`/authors/${id}`);
      setAuthors((prev) => prev.filter((author) => author.id !== id));
      
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Tác giả đã được xóa thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting author:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi xóa tác giả.',
        icon: 'error'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "Nam",
      image: "",
      description: "",
      nationality: "",
      total_work: "",
    });
    setEditingAuthor(null);
    setShowModal(false);
  };

  const getGenderColor = (gender) => {
    return gender === "Nam"
      ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
      : "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border border-pink-300";
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setEditingAuthor(null);
    }
  };

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const res = await api.get("/authors");
        setAuthors(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch authors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/authors-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/50 relative overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
          color === "blue"
            ? "from-blue-400 to-indigo-600"
            : color === "green"
            ? "from-green-400 to-emerald-600"
            : color === "purple"
            ? "from-purple-400 to-violet-600"
            : "from-pink-400 to-rose-600"
        }`}
      ></div>

      <div className="flex items-center relative">
        <div
          className={`p-3 rounded-2xl shadow-lg ${
            color === "blue"
              ? "bg-gradient-to-br from-blue-400 to-indigo-600"
              : color === "green"
              ? "bg-gradient-to-br from-green-400 to-emerald-600"
              : color === "purple"
              ? "bg-gradient-to-br from-purple-400 to-violet-600"
              : "bg-gradient-to-br from-pink-400 to-rose-600"
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
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-24 mb-2"></div>
          <div className="h-6 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
              Quản lý tác giả
            </h2>
            <p className="text-slate-600 mt-1">
              Quản lý thông tin tác giả và tác phẩm
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium 
                     hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 
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
              <span>Thêm tác giả</span>
            </div>
          </button>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Tổng tác giả"
              value={stats.authorsTotal || 0}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Sách hiện có"
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
              title="Tác giả nam"
              value={stats.maleAuthors || 0}
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Tác giả nữ"
              value={stats.femaleAuthors || 0}
              color="pink"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
          </div>
        )}

        {/* Authors Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-purple-50">
            <h3 className="text-xl font-bold text-slate-800">
              Danh sách tác giả
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tác giả
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tuổi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Giới tính
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Quốc tịch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tổng tác phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Ngày tham gia
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
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse"></div>
                            <div className="ml-4">
                              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-32 mb-2 animate-pulse"></div>
                              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-48 animate-pulse"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-10 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-20 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-16 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-14 animate-pulse"></div>
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
                  : authors.map((author) => (
                      <tr
                        key={author.id}
                        className="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-purple-50/30 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                className="h-12 w-12 rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-200 border-2 border-white"
                                src={
                                  getImageUrl(author.image) ||
                                  getBookPlaceholder(48, 64)
                                }
                                alt={author.name}
                              />
                              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                                {author.name}
                              </div>
                              <div className="text-sm text-slate-600 font-medium max-w-xs truncate">
                                {author.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                          {author.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getGenderColor(
                              author.gender
                            )}`}
                          >
                            {author.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                          {author.nationality || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                          {author.total_work}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                          {dayjs(author.created_at).format("DD/MM/YYYY")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(author)}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg 
                                     hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 
                                     shadow-md hover:shadow-lg"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
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
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(author.id)}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg 
                                     hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 
                                     shadow-md hover:shadow-lg"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
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
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
          >
            <div
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto 
                         shadow-2xl border border-white/50 transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
                  {editingAuthor ? "Sửa tác giả" : "Thêm tác giả mới"}
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

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tên tác giả
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                               focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                               placeholder-slate-400 text-slate-700 font-medium"
                      placeholder="Nhập tên tác giả"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tuổi
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                               focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                               placeholder-slate-400 text-slate-700 font-medium"
                      placeholder="Nhập tuổi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tổng tác phẩm
                    </label>
                    <input
                      type="number"
                      name="total_work"
                      value={formData.total_work}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                               focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                               placeholder-slate-400 text-slate-700 font-medium"
                      placeholder="Nhập tổng số tác phẩm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                               focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                               text-slate-700 font-medium"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Quốc tịch
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                             focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                             placeholder-slate-400 text-slate-700 font-medium"
                    placeholder="Nhập quốc tịch (VD: Việt Nam)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hình ảnh
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                             focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                             text-slate-700 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                             file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {formData.image && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative">
                        <img
                          src={
                            formData.image instanceof File
                              ? URL.createObjectURL(formData.image)
                              : getImageUrl(formData.image) ||
                                getBookPlaceholder(80, 80)
                          }
                          alt="Preview"
                          className="h-20 w-20 rounded-full object-cover shadow-lg border-2 border-purple-200"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                             focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                             placeholder-slate-400 text-slate-700 font-medium resize-none"
                    placeholder="Nhập mô tả về tác giả"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                             text-white py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 
                             shadow-lg hover:shadow-xl font-medium"
                  >
                    {editingAuthor ? "Cập nhật" : "Thêm mới"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-6 rounded-xl 
                             transition-all duration-200 font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
