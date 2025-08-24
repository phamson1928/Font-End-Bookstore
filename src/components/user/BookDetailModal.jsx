import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { getImageUrl, getBookPlaceholder } from "../../utils/imageUtils";

export const BookDetailModal = ({ isOpen, onClose, book }) => {
  const modalClass = isOpen ? "show" : "hide";
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  // const navigate = useNavigate();

  if (!book) return null;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
    alert(`Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addToCart(book, quantity);
    alert(
      `Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng! Chuyển đến trang thanh toán...`
    );
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const discountPercent = Math.round(
    ((book.price - book.discount_price) / book.price) * 100
  );

  return (
    <div
      className={`modal fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40 ${modalClass}`}
      onClick={handleBackdropClick}
    >
      <div className="modal-content bg-white  w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl">
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
                src={getImageUrl(book.image) || getBookPlaceholder(400, 600)}
                alt={book.title}
                className="w-full rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = getBookPlaceholder(400, 600);
                }}
              />
              <div className="bg-gray-100 p-4 rounded-lg mt-4 md:mt-6">
                <h4 className="font-medium text-gray-800 mb-2">Mô tả:</h4>
                <p className="text-gray-700">{book.description}</p>
              </div>
            </div>

            <div className="md:w-2/3 md:pl-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {book.title}
              </h1>
              <p className="text-blue-600 mb-4">
                Tác giả:{" "}
                <button
                  onClick={() => {
                    onClose();
                    // navigate(`/author/${encodeURIComponent(book.author)}`);
                  }}
                  className="font-medium hover:underline hover:text-blue-800 transition duration-200"
                >
                  {book.author}
                </button>
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
                  đ{Number(book.discount_price).toLocaleString("vi-VN")}
                </span>
                {book.price > book.discount_price && (
                  <span className="text-gray-500 text-lg line-through ml-3">
                    đ{Number(book.price).toLocaleString("vi-VN")}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-red-500 text-white text-xl font-bold px-2 py-1 rounded ml-4">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {/* Actions: quantity + buttons */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        aria-label="Giảm số lượng"
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={handleQuantityInput}
                        className="w-14 h-8 text-center text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 99}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        aria-label="Tăng số lượng"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="text-sm text-gray-600">
                      Tổng: {" "}
                      <span className="font-semibold text-red-600">
                        đ
                        {(book.discount_price * quantity).toLocaleString("vi-VN")}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Thêm {quantity}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-bolt mr-2"></i>
                    Mua ngay
                  </button>
                </div>
              </div>

              

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-800 mb-4">
                  Thông tin chi tiết:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Ngày xuất bản:</span>
                    <span className="w-1/2 text-blue-600 ">
                      {book.publication_date}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Ngôn ngữ:</span>
                    <span className="w-1/2 text-blue-600 ">
                      {book.language}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Trọng lượng:</span>
                    <span className="w-1/2 text-blue-600 ">
                      {book.weight_in_grams}{" "}
                      <span className="text-gray-600" fontSize="xs">
                        gram
                      </span>
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">
                      Kích thước đóng gói:
                    </span>
                    <span className="w-1/2 text-blue-600">
                      {book.packaging_size_cm}{" "}
                      <span className="text-gray-600" fontSize="xs">
                        cm
                      </span>
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Số trang:</span>
                    <span className="w-1/2 text-blue-600">
                      {book.number_of_pages}{" "}
                      <span className="text-gray-600" fontSize="xs">
                        trang
                      </span>
                    </span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Trạng thái:</span>
                    <span className="w-1/2 text-blue-600">{book.state}</span>
                  </div>

                  <div className="flex">
                    <span className="w-1/2 text-gray-600">Kiểu sách:</span>
                    <span className="w-1/2 text-blue-600 ">{book.form}</span>
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
