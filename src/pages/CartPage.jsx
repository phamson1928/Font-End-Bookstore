import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Header } from "../components/user/Header";
import { getImageUrl } from "../utils/imageUtils";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCart();

  const handleQuantityChange = (itemId, change) => {
    const item = items.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(itemId, newQuantity);
      }
    }
  };

  const handleQuantityInput = (itemId, value) => {
    const quantity = parseInt(value) || 1;
    if (quantity > 0) {
      updateQuantity(itemId, quantity);
    }
  };

  const handleCheckout = () => {
    alert("Chức năng thanh toán sẽ được phát triển trong tương lai!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Tiếp tục mua sắm
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các cuốn
              sách tuyệt vời của chúng tôi!
            </p>
            <Link
              to="/"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              <i className="fas fa-book mr-2"></i>
              Khám phá sách
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Sản phẩm ({items.length})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <i className="fas fa-trash mr-1"></i>
                      Xóa tất cả
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="w-20 h-28 object-cover rounded-lg shadow-sm"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-800 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            Tác giả: {item.author}
                          </p>
                          <p className="text-xl font-semibold text-red-600 mb-4">
                            đ
                            {Number(
                              item?.discount_price ?? item?.price ?? 0
                            ).toLocaleString()}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700">
                                Số lượng:
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, -1)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <i className="fas fa-minus text-xs"></i>
                                </button>

                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityInput(item.id, e.target.value)
                                  }
                                  className="w-16 h-8 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, 1)
                                  }
                                  disabled={item.quantity >= 99}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <i className="fas fa-plus text-xs"></i>
                                </button>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                            >
                              <i className="fas fa-trash mr-1"></i>
                              Xóa
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="mt-3 text-right">
                            <span className="text-sm text-gray-600">
                              Thành tiền:{" "}
                            </span>
                            <span className="text-lg font-semibold text-gray-800">
                              đ
                              {(
                                Number(
                                  item?.discount_price ?? item?.price ?? 0
                                ) * Number(item?.quantity ?? 0)
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>đ{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600">
                        đ{getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center mb-3"
                >
                  <i className="fas fa-credit-card mr-2"></i>
                  Thanh toán
                </button>

                <Link
                  to="/"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  <i className="fas fa-shopping-bag mr-2"></i>
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
