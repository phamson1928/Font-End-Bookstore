export const BookDetailModal = ({ isOpen, onClose, book }) => {
  const modalClass = isOpen ? "show" : "hide";

  if (!book) return null;

  return (
    <div
      className={`modal fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40 ${modalClass}`}
    >
      <div className="modal-content bg-white  w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Chi tiết sách</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <img
                src={book.image}
                alt={book.title}
                className="w-full rounded-lg shadow-md"
              />

              <div className="mt-6 space-y-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center">
                  <i className="fas fa-shopping-cart mr-2"></i> Thêm vào giỏ
                  hàng
                </button>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center">
                  <i className="fas fa-bolt mr-2"></i> Mua ngay
                </button>
              </div>
            </div>

            <div className="md:w-2/3 md:pl-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {book.title}
              </h2>
              <p className="text-gray-600 mb-4">
                Tác giả: <span className="font-medium">{book.author}</span>
              </p>

              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <span className="text-gray-600 ml-2">(120 đánh giá)</span>
              </div>

              <div className="mb-6">
                <span className="text-2xl font-bold text-red-600">
                  {book.price.toLocaleString()}đ
                </span>
                {book.oldPrice > book.price && (
                  <span className="text-gray-500 text-lg line-through ml-3">
                    {book.oldPrice.toLocaleString()}đ
                  </span>
                )}
              </div>

              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Mô tả:</h4>
                <p className="text-gray-700">{book.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-800 mb-4">
                  Thông tin chi tiết:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Ngày xuất bản:</span>
                    <span className="w-1/2 text-gray-800">
                      {book.publishDate}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Ngôn ngữ:</span>
                    <span className="w-1/2 text-gray-800">{book.language}</span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Trọng lượng:</span>
                    <span className="w-1/2 text-gray-800">{book.weight}</span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">
                      Kích thước đóng gói:
                    </span>
                    <span className="w-1/2 text-gray-800">
                      {book.packageSize}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Số trang:</span>
                    <span className="w-1/2 text-gray-800">{book.pages}</span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Trạng thái:</span>
                    <span className="w-1/2 text-gray-800">{book.status}</span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Kiểu sách:</span>
                    <span className="w-1/2 text-gray-800">{book.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
