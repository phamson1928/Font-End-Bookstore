import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";
import { getImageUrl, getBookPlaceholder } from "../../utils/imageUtils";
import { getToken } from "../../api";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export const BookDetailModal = ({ isOpen, onClose, book }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();
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
    const token = getToken();
    if (!token) {
      toast.info("Vui lòng đăng nhập hoặc đăng ký nếu chưa có tài khoản để thêm sách vào giỏ hàng!", {
        autoClose: 3000,
      });
      return;
    }
    addToCart(book, quantity);
    toast.success(`Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng!`, {
      autoClose: 1600,
      hideProgressBar: true,
    });
  };

  const handleBuyNow = () => {
    const token = getToken();
    if (!token) {
      toast.info("Vui lòng đăng nhập hoặc đăng ký nếu chưa có tài khoản để mua sách!", {
        autoClose: 3000,
      });
      return;
    }
    addToCart(book, quantity);
    navigate("/cart");
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-sm w-full max-w-5xl max-h-[95vh] overflow-y-auto 
                     rounded-3xl shadow-2xl border border-white/50 custom-scrollbar"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  Chi tiết sách
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl 
                           transition-all duration-200 transform hover:scale-110"
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

              {/* Body */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side - Image and Description */}
                <div className="lg:w-1/3 space-y-6">
                  <div className="relative group">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-2xl 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                    <img
                      src={
                        getImageUrl(book.image) || getBookPlaceholder(400, 600)
                      }
                      alt={book.title}
                      className="w-full rounded-2xl shadow-xl transform transition-transform duration-300 
                               group-hover:scale-105 border-4 border-white"
                      onError={(e) => {
                        e.target.src = getBookPlaceholder(400, 600);
                      }}
                    />
                  </div>

                  <div
                    className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm p-6 rounded-2xl 
                                border border-white/50 shadow-lg"
                  >
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center text-lg">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Mô tả:
                    </h4>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {book.description}
                    </p>
                  </div>
                </div>

                {/* Right side - Details */}
                <div className="lg:w-2/3 space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-3 leading-tight">
                      {book.title}
                    </h1>
                    <p className="text-blue-600 mb-4 flex items-center text-lg">
                      <svg
                        className="w-5 h-5 mr-2"
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
                      Tác giả:{" "}
                      <button
                        onClick={() => {
                          onClose();
                          // navigate(`/author/${encodeURIComponent(book.author)}`);
                        }}
                        className="font-semibold hover:underline hover:text-blue-800 transition-all duration-200 
                                 transform hover:scale-105 ml-2"
                      >
                        {book.author}
                      </button>
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-6 bg-yellow-50 rounded-xl p-3 w-fit">
                      <div className="flex text-yellow-500 space-x-1">
                        {[1, 2, 3, 4].map((i) => (
                          <svg
                            key={i}
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <defs>
                            <linearGradient id="half">
                              <stop offset="50%" stopColor="currentColor" />
                              <stop offset="50%" stopColor="#e5e7eb" />
                            </linearGradient>
                          </defs>
                          <path
                            fill="url(#half)"
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-600 ml-2 font-medium">
                        (120 đánh giá)
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div
                    className="bg-gradient-to-r from-red-50/80 to-pink-50/80 backdrop-blur-sm p-6 rounded-2xl 
                                border border-white/50 shadow-lg"
                  >
                    <div className="flex items-center flex-wrap gap-4">
                      <span className="text-3xl font-bold text-red-600 flex items-center">
                        <svg
                          className="w-6 h-6 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        đ{Number(book.discount_price).toLocaleString("vi-VN")}
                      </span>
                      {book.price > book.discount_price && (
                        <span className="text-slate-500 text-xl line-through">
                          đ{Number(book.price).toLocaleString("vi-VN")}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <div
                          className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg font-bold 
                                      px-4 py-2 rounded-full shadow-lg animate-pulse"
                        >
                          -{discountPercent}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity + actions */}
                  <div
                    className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-6 rounded-2xl 
                                border border-white/50 shadow-lg"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                          Số lượng
                        </label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center 
                                     hover:bg-slate-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed 
                                     transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            aria-label="Giảm số lượng"
                          >
                            <svg
                              className="w-4 h-4 text-slate-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={quantity}
                            onChange={handleQuantityInput}
                            className="w-16 h-10 text-center text-lg font-bold border-2 border-slate-200 rounded-xl 
                                     focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white shadow-md
                                     transition-all duration-200"
                          />
                          <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= 99}
                            className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center 
                                     hover:bg-slate-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed 
                                     transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            aria-label="Tăng số lượng"
                          >
                            <svg
                              className="w-4 h-4 text-slate-600"
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
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-600 block mb-2">
                          Tổng cộng:
                        </span>
                        <span className="text-2xl font-bold text-red-600">
                          đ
                          {(book.discount_price * quantity).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                                 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 
                                 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 18a2 2 0 11-4 0 2 2 0 014 0zM9 18a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Thêm {quantity} vào giỏ
                      </button>
                      <button
                        onClick={handleBuyNow}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                                 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 
                                 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Mua ngay
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div
                    className="bg-gradient-to-r from-slate-50/80 to-purple-50/80 backdrop-blur-sm p-6 rounded-2xl 
                                border border-white/50 shadow-lg"
                  >
                    <h4 className="font-bold text-slate-800 mb-6 text-xl flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Thông tin chi tiết
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Ngày xuất bản",
                          value: book.publication_date,
                          icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                        },
                        {
                          label: "Ngôn ngữ",
                          value: book.language,
                          icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
                        },
                        {
                          label: "Trọng lượng",
                          value: `${book.weight_in_grams} gram`,
                          icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
                        },
                        {
                          label: "Kích thước",
                          value: `${book.packaging_size_cm} cm`,
                          icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
                        },
                        {
                          label: "Số trang",
                          value: `${book.number_of_pages} trang`,
                          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                        },
                        {
                          label: "Trạng thái",
                          value: book.state,
                          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                        },
                        {
                          label: "Kiểu sách",
                          value: book.form,
                          icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mr-4">
                            <svg
                              className="w-5 h-5 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={item.icon}
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm text-slate-600 font-medium block">
                              {item.label}:
                            </span>
                            <span className="text-blue-600 font-semibold">
                              {item.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
