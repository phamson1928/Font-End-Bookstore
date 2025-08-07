import React from "react";
import { useCart } from "../../contexts/CartContext";

export const CartDropdown = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCart();

  if (!isOpen) return null;

  const handleQuantityChange = (itemId, change) => {
    const item = items.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(itemId, newQuantity);
      }
    }
  };

  const handleCheckout = () => {
    alert("Chức năng thanh toán sẽ được phát triển trong tương lai!");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Cart Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Giỏ hàng</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Cart Items */}
        <div className="max-h-64 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <i className="fas fa-shopping-cart text-4xl mb-3 text-gray-300"></i>
              <p>Giỏ hàng trống</p>
              <p className="text-sm">Hãy thêm sách vào giỏ hàng!</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {item.author}
                    </p>
                    <p className="text-sm font-semibold text-red-600">
                      {item.price.toLocaleString()}đ
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-xs"
                    >
                      <i className="fas fa-minus"></i>
                    </button>

                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-xs"
                    >
                      <i className="fas fa-plus"></i>
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs ml-2"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Tổng cộng:
              </span>
              <span className="text-lg font-bold text-red-600">
                {getTotalPrice().toLocaleString()}đ
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm transition duration-300"
              >
                Xóa tất cả
              </button>

              <button
                onClick={handleCheckout}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition duration-300"
              >
                Thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
