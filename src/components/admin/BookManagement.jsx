import { useState, useEffect } from "react";
import { BookForm } from "./BookForm";
import { api } from "../../api";
import { getImageUrl, getBookPlaceholder } from "../../utils/imageUtils";

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

  const handleAddBook = async (formData, e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Log FormData để debug
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      // Sử dụng FormData với multipart/form-data
      const response = await api.post("/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Book added successfully:", response.data);
      // Fetch lại danh sách sách từ server
      await fetchBooks();
      // Đóng form
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding book:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = async (formData, e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sử dụng FormData với multipart/form-data
      const response = await api.put(`/books/${editingBook.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Book updated successfully:", response.data);

      // Fetch lại danh sách sách từ server
      await fetchBooks();

      // Đóng form
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Có lỗi xảy ra khi cập nhật sách. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      return;
    }

    try {
      await api.delete(`/books/${bookId}`);
      console.log("Book deleted successfully");

      // Fetch lại danh sách sách từ server
      await fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Có lỗi xảy ra khi xóa sách. Vui lòng thử lại.");
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

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-black text-xl font-semibold">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý sách</h2>
          <p className="text-gray-600">Thêm, sửa, xóa sản phẩm sách</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang xử lý..." : "Thêm sách mới"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredBooks.length} sách được tìm thấy
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={
                        getImageUrl(book.image) || getBookPlaceholder(48, 64)
                      }
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {book.category?.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {book.price.toLocaleString()}đ
                      </div>
                      {book.oldPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {book.oldPrice.toLocaleString()}đ
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        book.state === "Còn hàng"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingBook ? "Sửa sách" : "Thêm sách mới"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBook(null);
                }}
                className="text-gray-400 hover:text-gray-600"
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
              loading={loading}
              onCancel={() => {
                setShowAddForm(false);
                setEditingBook(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
