import { useState } from "react";
import { BookForm } from "./BookForm";

export const BookManagement = () => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      price: 120000,
      oldPrice: 150000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23f8d775'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3EĐắc Nhân Tâm%3C/text%3E%3C/svg%3E",
      publishDate: "01/01/2020",
      description:
        "Đắc nhân tâm là quyển sách nổi tiếng nhất, bán chạy nhất và có tầm ảnh hưởng nhất của mọi thời đại.",
      language: "Tiếng Việt",
      weight: "350g",
      packageSize: "20.5 x 14.5 x 1.5 cm",
      pages: 320,
      status: "Còn hàng",
      type: "Sách bìa mềm",
      category: "bestseller",
    },
    {
      id: 2,
      title: "Nhà Giả Kim",
      author: "Paulo Coelho",
      price: 79000,
      oldPrice: 99000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23a2d2ff'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ENhà Giả Kim%3C/text%3E%3C/svg%3E",
      publishDate: "15/05/2019",
      description:
        "Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc.",
      language: "Tiếng Việt",
      weight: "280g",
      packageSize: "20 x 14 x 1.2 cm",
      pages: 228,
      status: "Còn hàng",
      type: "Sách bìa mềm",
      category: "bestseller",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddBook = (newBook) => {
    const bookWithId = {
      ...newBook,
      id: Math.max(...books.map((b) => b.id)) + 1,
    };
    setBooks([...books, bookWithId]);
    setShowAddForm(false);
  };

  const handleEditBook = (updatedBook) => {
    setBooks(
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
    setEditingBook(null);
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      setBooks(books.filter((book) => book.id !== bookId));
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý sách</h2>
          <p className="text-gray-600">Thêm, sửa, xóa sản phẩm sách</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thêm sách mới
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
                      src={book.image}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {book.category}
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
                        book.status === "Còn hàng"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.status}
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
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              onSubmit={editingBook ? handleEditBook : handleAddBook}
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
