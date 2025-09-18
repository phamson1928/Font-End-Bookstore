import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Header } from "../components/user/Header";
import { getImageUrl } from "../utils/imageUtils";
import { api } from "../api";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Tag,
  Truck,
  ShoppingBag,
  Loader2,
  CheckCircle,
} from "lucide-react";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCart();

  useEffect(() => {
    const fetchStoreDiscount = async () => {
      try {
        const response = await api.get("/discounts/active");
        if (response.data?.discount_percent) {
          setStoreDiscount(response.data.discount_percent);
        }
      } catch (error) {
        console.error("Error fetching store discount:", error);
      }
    };
    fetchStoreDiscount();
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [storeDiscount, setStoreDiscount] = useState(0);

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
        toast.info(
          "Vui lòng nhập số điện thoại hợp lệ (10 số, bắt đầu bằng 0)."
        );
        return;
      }
      if (!address?.trim()) {
        toast.info("Vui lòng nhập địa chỉ giao hàng.");
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
        toast.success(order?.id ? `${message} Mã đơn: ${order.id}` : message);
      } catch (err) {
        console.error("Tạo đơn hàng thất bại:", err);
        const apiMsg = err?.response?.data?.error || err?.message;
        toast.error(
          apiMsg
            ? `Lỗi khi đặt hàng: ${apiMsg}`
            : "Lỗi khi đặt hàng. Vui lòng thử lại."
        );
      }
    } else if (paymentMethod === "card") {
      toast.info(
        "Bạn đã chọn thanh toán bằng thẻ. Tính năng cổng thanh toán sẽ được tích hợp sau."
      );
    } else {
      toast.info("Vui lòng chọn phương thức thanh toán.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
              Giỏ hàng của bạn
            </h1>
            <p className="text-slate-600 font-medium">
              {items.length > 0
                ? `Bạn có ${items.length} sản phẩm trong giỏ hàng`
                : "Giỏ hàng đang trống"}
            </p>
          </div>
          <Link
            to="/"
            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Discount Banner */}
        {storeDiscount > 0 && items.length > 0 && (
          <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-2xl shadow-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 animate-pulse"></div>
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                  <i className="fas fa-fire text-white text-2xl animate-bounce"></i>
                </div>
                <div className="text-white">
                  <h2 className="text-3xl font-black mb-1">
                    🔥 KHUYẾN MÃI HOT 🔥
                  </h2>
                  <p className="text-lg font-semibold opacity-90">
                    Giảm ngay <span className="text-4xl font-black text-yellow-300">{storeDiscount}%</span> cho toàn bộ đơn hàng!
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-white font-bold text-lg mb-2">
                  💰 Bạn tiết kiệm được: <span className="text-yellow-300 text-2xl">
                    {Math.round(getTotalPrice() * (storeDiscount / 100)).toLocaleString()}đ
                  </span>
                </p>
                <p className="text-white/80 text-sm">
                  ⏰ Ưu đãi có thể kết thúc bất cứ lúc nào - Đặt hàng ngay!
                </p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-white/20 text-6xl">
              <i className="fas fa-percent"></i>
            </div>
            <div className="absolute bottom-4 left-4 text-white/20 text-4xl">
              <i className="fas fa-tags"></i>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-16 text-center">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các cuốn
              sách tuyệt vời của chúng tôi!
            </p>
            <Link
              to="/"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              Khám phá sách ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                {/* Cart Header */}
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 border-b border-slate-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ShoppingCart className="w-6 h-6 text-blue-600 mr-3" />
                      <h2 className="text-xl font-bold text-slate-800">
                        Sản phẩm ({items.length})
                      </h2>
                    </div>
                    <button
                      onClick={clearCart}
                      className="group flex items-center text-red-600 hover:text-red-800 font-semibold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Xóa tất cả
                    </button>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-slate-200">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-6">
                        {/* Book Image */}
                        <div className="relative group">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="w-24 h-32 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                                {item.title}
                              </h3>
                              <p className="text-slate-600 font-medium mb-3">
                                Tác giả:{" "}
                                <span className="text-blue-600">
                                  {item.author}
                                </span>
                              </p>
                              <div className="flex items-center space-x-3">
                                <p className="text-2xl font-bold text-red-600">
                                  {Number(
                                    item?.discount_price ?? item?.price ?? 0
                                  ).toLocaleString()}
                                  đ
                                </p>
                                {item.discount_price &&
                                  item.price > item.discount_price && (
                                    <p className="text-lg text-slate-500 line-through">
                                      {Number(item.price).toLocaleString()}đ
                                    </p>
                                  )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="group text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-all duration-300"
                            >
                              <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-semibold text-slate-700">
                                Số lượng:
                              </span>
                              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, -1)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                                >
                                  <Minus className="w-4 h-4 text-slate-600" />
                                </button>

                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityInput(item.id, e.target.value)
                                  }
                                  className="w-16 h-10 text-center border-0 bg-transparent font-bold text-slate-800 focus:outline-none"
                                />

                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, 1)
                                  }
                                  disabled={item.quantity >= 99}
                                  className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                                >
                                  <Plus className="w-4 h-4 text-slate-600" />
                                </button>
                              </div>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right">
                              <span className="text-sm text-slate-600 block">
                                Thành tiền:
                              </span>
                              <span className="text-xl font-bold text-slate-800">
                                {(
                                  Number(
                                    item?.discount_price ?? item?.price ?? 0
                                  ) * Number(item?.quantity ?? 0)
                                ).toLocaleString()}
                                đ
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 sticky top-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  Tóm tắt đơn hàng
                </h2>

                {/* Price Summary */}
                <div className="space-y-4 mb-8 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                  <div className="flex justify-between text-slate-600 text-lg">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">
                      {getTotalPrice().toLocaleString()}đ
                    </span>
                  </div>
                  {storeDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center font-medium">
                        <Tag className="w-4 h-4 mr-2" />
                        Giảm giá cửa hàng (-{storeDiscount}%):
                      </span>
                      <span className="font-semibold">
                        -
                        {Math.round(
                          getTotalPrice() * (storeDiscount / 100)
                        ).toLocaleString()}
                        đ
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      Phí vận chuyển:
                    </span>
                    <span className="text-green-600 font-semibold">
                      Miễn phí
                    </span>
                  </div>
                  <div className="border-t border-slate-300 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-slate-800">Tổng cộng:</span>
                      <span className="text-red-600">
                        {(
                          getTotalPrice() -
                          (storeDiscount > 0
                            ? Math.round(
                                getTotalPrice() * (storeDiscount / 100)
                              )
                            : 0)
                        ).toLocaleString()}
                        đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <Truck className="w-5 h-5 text-blue-600 mr-2" />
                    Thông tin giao hàng
                  </h3>
                  <div className="space-y-4">
                    {/* Phone Input */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="VD: 0912345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                      />
                      {phone && !isValidPhone(phone) && (
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          Số điện thoại không hợp lệ.
                        </p>
                      )}
                    </div>

                    {/* Address Input */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-slate-700 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          Địa chỉ giao hàng
                        </label>
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={isLoading}
                          className="text-xs text-blue-600 hover:text-blue-800 disabled:text-slate-400 flex items-center gap-1 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-all duration-300"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Đang lấy vị trí...
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3 h-3" />
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
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-y bg-white/80"
                      />
                      {locationError && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                          {locationError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                    Phương thức thanh toán
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`border-2 rounded-xl p-4 text-left transition-all duration-300 hover:scale-105 ${
                        paymentMethod === "cod"
                          ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                          : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <Banknote
                          className={`w-6 h-6 mr-3 ${
                            paymentMethod === "cod"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        />
                        <div>
                          <div className="font-bold text-slate-800">
                            Trực tiếp
                          </div>
                          <div className="text-xs text-slate-500">
                            Thanh toán khi nhận hàng
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`border-2 rounded-xl p-4 text-left transition-all duration-300 hover:scale-105 ${
                        paymentMethod === "card"
                          ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                          : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <CreditCard
                          className={`w-6 h-6 mr-3 ${
                            paymentMethod === "card"
                              ? "text-blue-600"
                              : "text-indigo-600"
                          }`}
                        />
                        <div>
                          <div className="font-bold text-slate-800">Thẻ</div>
                          <div className="text-xs text-slate-500">
                            Visa / Mastercard
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {paymentMethod === "card" ? (
                      <CreditCard className="w-5 h-5 mr-3" />
                    ) : (
                      <Banknote className="w-5 h-5 mr-3" />
                    )}
                    {paymentMethod === "card"
                      ? "Thanh toán thẻ"
                      : "Thanh toán COD"}
                  </button>

                  <Link
                    to="/"
                    className="w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800 font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBag className="w-5 h-5 mr-3" />
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
