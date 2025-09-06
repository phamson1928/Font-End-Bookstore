import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Header } from "../components/user/Header";
import { getImageUrl } from "../utils/imageUtils";
import { api } from "../api";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const getLocationByIP = async () => {
    try {
      console.log("Đang lấy vị trí dựa trên IP...");

      // Thử dùng ipinfo.io trước
      try {
        const response = await fetch(
          "https://ipinfo.io/json?token=7f7e6d5c4b3a2"
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Dữ liệu từ ipinfo.io:", data);
          const { city, region, country } = data;
          return [city, region, country].filter(Boolean).join(", ");
        }
      } catch (e) {
        console.log("ipinfo.io không khả dụng, thử phương án dự phòng...", e);
      }

      // Fallback: Sử dụng ip-api.com nếu ipinfo.io bị lỗi
      const fallbackResponse = await fetch("http://ip-api.com/json/");
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log("Dữ liệu từ ip-api.com:", data);
        const { city, regionName, country } = data;
        return [city, regionName, country].filter(Boolean).join(", ");
      }

      return "";
    } catch (error) {
      console.error("Lỗi khi lấy vị trí từ IP:", error);
      return "";
    }
  };

  const handleGetLocation = async () => {
    setIsLoading(true);
    setLocationError("");

    try {
      // Thử lấy vị trí chính xác trước
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          });

          // Nếu lấy được vị trí chính xác, lấy địa chỉ
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&accept-language=vi`
          );

          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              setAddress(data.display_name);
              return;
            }
          }
        } catch (error) {
          console.log(
            "Không thể lấy vị trí chính xác, thử lấy theo IP...",
            error
          );
        }
      }

      // Nếu không lấy được vị trí chính xác, dùng IP-based location
      const ipBasedAddress = await getLocationByIP();
      if (ipBasedAddress) {
        setAddress(ipBasedAddress);
      } else {
        setLocationError(
          "Không thể lấy được vị trí. Vui lòng thử lại hoặc nhập thủ công."
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy vị trí:", error);
      setLocationError("Có lỗi xảy ra khi lấy vị trí. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const isValidPhone = (value) => {
    const digits = (value || "").replace(/\D/g, "");
    return /^0\d{9}$/.test(digits);
  };

  const handleCheckout = async () => {
    if (paymentMethod === "cod") {
      if (!isValidPhone(phone)) {
        alert("Vui lòng nhập số điện thoại hợp lệ (10 số, bắt đầu bằng 0).");
        return;
      }
      if (!address?.trim()) {
        alert("Vui lòng nhập địa chỉ giao hàng.");
        return;
      }
      try {
        const res = await api.post("/orders", {
          payment_method: paymentMethod,
          phone,
          address,
        });
        const order = res?.data?.order;
        const message = res?.data?.message ?? "Đặt hàng thành công!";
        clearCart();
        alert(order?.id ? `${message} Mã đơn: ${order.id}` : message);
      } catch (err) {
        console.error("Tạo đơn hàng thất bại:", err);
        const apiMsg = err?.response?.data?.error || err?.message;
        alert(
          apiMsg
            ? `Lỗi khi đặt hàng: ${apiMsg}`
            : "Lỗi khi đặt hàng. Vui lòng thử lại."
        );
      }
    } else if (paymentMethod === "card") {
      alert(
        "Bạn đã chọn thanh toán bằng thẻ. Tính năng cổng thanh toán sẽ được tích hợp sau."
      );
    } else {
      alert("Vui lòng chọn phương thức thanh toán.");
    }
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

                {/* Shipping Info */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Thông tin giao hàng
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="VD: 0912345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {phone && !isValidPhone(phone) && (
                        <p className="text-xs text-red-600 mt-1">
                          Số điện thoại không hợp lệ.
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm text-gray-600">
                          Địa chỉ giao hàng
                        </label>
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={isLoading}
                          className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center gap-1"
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin h-3 w-3 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Đang lấy vị trí...
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Lấy vị trí hiện tại
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                      />
                      {locationError && (
                        <p className="mt-1 text-xs text-red-600">
                          {locationError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Phương thức thanh toán
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`border rounded-lg p-3 text-left transition shadow-sm ${
                        paymentMethod === "cod"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <i className="fas fa-money-bill-wave text-green-600 mr-2"></i>
                        <div>
                          <div className="font-medium text-gray-800">
                            Trực tiếp
                          </div>
                          <div className="text-xs text-gray-500">
                            Thanh toán khi nhận hàng
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`border rounded-lg p-3 text-left transition shadow-sm ${
                        paymentMethod === "card"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <i className="fas fa-credit-card text-blue-600 mr-2"></i>
                        <div>
                          <div className="font-medium text-gray-800">Thẻ</div>
                          <div className="text-xs text-gray-500">
                            Visa / Mastercard
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center mb-3"
                >
                  <i
                    className={`fas ${
                      paymentMethod === "card"
                        ? "fa-credit-card"
                        : "fa-money-bill-wave"
                    } mr-2`}
                  ></i>
                  {paymentMethod === "card"
                    ? "Thanh toán thẻ"
                    : "Thanh toán COD"}
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
