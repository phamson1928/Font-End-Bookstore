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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/50">
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

        {/* Books Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="bg-white/60 rounded-xl border border-slate-200/50 p-4 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-3/4"></div>
                      <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-1/2"></div>
                      <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white/60 rounded-xl border border-slate-200/50 p-4 hover:bg-white/80 hover:shadow-lg transition-all duration-200 group">
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={getImageUrl(book.image) || getBookPlaceholder(64, 80)}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                        onError={(e) => {
                          e.target.src = getBookPlaceholder(64, 80);
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{book.author}</p>
                      <p className="text-xs text-slate-500 mt-1">{book.category?.name}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">
                            {Number(book.price).toLocaleString("vi-VN")}đ
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                            book.state === "Còn hàng"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {book.state}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingBook(book)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                            title="Sửa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                            title="Xóa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Book Form Modal */}
        {(showAddForm || editingBook) && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-2"
            onClick={handleBackdropClick}
          >
            <div
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 w-full max-w-4xl max-h-[95vh] overflow-y-auto 
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
