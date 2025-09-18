import { useState, useEffect } from "react";
import { BookForm } from "./BookForm";
import { api } from "../../api";
import { getImageUrl, getBookPlaceholder } from "../../utils/imageUtils";
import Swal from "sweetalert2";

export const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/books");
      console.log("Books data from API:", data);
      if (data.length > 0) {
        console.log("First book image field:", data[0].image);
        console.log("First book full data:", data[0]);
      }
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
    setLoading(false);
  };

  const handleAddBook = async (formData) => {
    setLoading(true);

    try {
      console.log("[ADD] FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const response = await api.post("/books", formData);
      console.log("Book added successfully:", response.data);
      await fetchBooks();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding book:", error);
      if (error?.response) {
        console.error("[ADD] Response status:", error.response.status);
        console.error("[ADD] Response data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = async (formData) => {
    setLoading(true);

    try {
      if (formData instanceof FormData) {
        formData.append("_method", "PUT");
      }

      console.log("[EDIT] Updating book id:", editingBook?.id);
      console.log("[EDIT] FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await api.post(`/books/${editingBook.id}`, formData);

      console.log("Book updated successfully:", response.data);

      await fetchBooks();

      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
      if (error?.response) {
        console.error("[EDIT] Response status:", error.response.status);
        console.error("[EDIT] Response data:", error.response.data);
      }
      Swal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi cập nhật sách. Vui lòng thử lại.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa sách này?",
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
      await api.delete(`/books/${bookId}`);
      await fetchBooks();

      Swal.fire({
        title: "Đã xóa!",
        text: "Sách đã được xóa thành công.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi xóa sách.",
        icon: "error",
      });
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowAddForm(false);
      setEditingBook(null);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Quản lý sách
            </h2>
            <p className="text-slate-600 mt-1">Thêm, sửa, xóa sản phẩm sách</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={loading}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium 
                     hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
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
              <span>{loading ? "Đang xử lý..." : "Thêm sách mới"}</span>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1 w-full">
              {loading ? (
                <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl animate-pulse"></div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-slate-400"
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
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 
                             focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                             placeholder-slate-400 text-slate-700 font-medium"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              {loading ? (
                <div className="h-5 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">
                    {filteredBooks.length} sách được tìm thấy
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tên sách
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tác giả
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Trạng thái
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
                        key={`skeleton-${i}`}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-32 mb-2 animate-pulse"></div>
                          <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-24 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-24 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-20 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-16 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-12 animate-pulse"></div>
                            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-12 animate-pulse"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  : filteredBooks.map((book) => (
                      <tr
                        key={book.id}
                        className="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/30 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <img
                              src={
                                getImageUrl(book.image) ||
                                getBookPlaceholder(48, 64)
                              }
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                              onError={(e) => {
                                console.log(
                                  "Image failed to load for book:",
                                  book.title,
                                  "Image path:",
                                  book.image
                                );
                                e.target.src = getBookPlaceholder(48, 64);
                              }}
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                              {book.title}
                            </div>
                            <div className="text-sm text-slate-500 font-medium">
                              {book.category?.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                          {book.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-800">
                            {Number(book.price).toLocaleString("vi-VN")}đ
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                              book.state === "Còn hàng"
                                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                                : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {book.state}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingBook(book)}
                              className="group/btn px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                                       hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 
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
                              onClick={() => handleDeleteBook(book.id)}
                              className="group/btn px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg 
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
        </div>

        {/* Add/Edit Book Form Modal */}
        {(showAddForm || editingBook) && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
          >
            <div
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto 
                         shadow-2xl border border-white/50 transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  {editingBook ? "Sửa sách" : "Thêm sách mới"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBook(null);
                  }}
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

              <BookForm
                book={editingBook}
                categories={categories}
                handleAddBook={handleAddBook}
                handleEditBook={handleEditBook}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingBook(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
