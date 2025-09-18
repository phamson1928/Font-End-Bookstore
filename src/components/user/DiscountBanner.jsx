import React from "react";

const DiscountBanner = ({ discount, onShopNowClick }) => {
  if (!discount || discount <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-3xl shadow-2xl p-8 mb-12 relative overflow-hidden transform hover:scale-105 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 animate-pulse"></div>

      {/* Floating decorative elements */}
      <div className="absolute top-6 right-6 text-white/20 text-8xl animate-bounce">
        🎉
      </div>
      <div className="absolute bottom-6 left-6 text-white/20 text-6xl animate-pulse">
        💰
      </div>
      <div className="absolute top-1/2 right-1/4 text-white/10 text-4xl animate-spin">
        ✨
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
            <span className="text-2xl mr-3">🔥</span>
            <span className="text-white font-black text-lg tracking-wider">
              FLASH SALE
            </span>
            <span className="text-2xl ml-3">🔥</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
            GIẢM NGAY{" "}
            <span className="text-yellow-300 animate-pulse">
              {discount}%
            </span>
          </h2>

          <p className="text-2xl md:text-3xl font-bold text-white/90 mb-6 drop-shadow-lg">
            📚 CHO TẤT CẢ CÁC ĐƠN ĐẶT HÀNG TRONG HÔM NAY! 📚
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            <div className="flex items-center justify-center">
              <span className="text-3xl mr-3">⏰</span>
              <div>
                <p className="font-bold text-lg">CÓ HẠN</p>
                <p className="text-sm opacity-80">Nhanh tay kẻ bỏ lỡ!</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-3xl mr-3">🚚</span>
              <div>
                <p className="font-bold text-lg">MIỄN PHÍ SHIP</p>
                <p className="text-sm opacity-80">Giao hàng toàn quốc</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-3xl mr-3">🎁</span>
              <div>
                <p className="font-bold text-lg">QUÀ TẶNG</p>
                <p className="text-sm opacity-80">Bookmark đặc biệt</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onShopNowClick}
            className="bg-white hover:bg-yellow-100 text-red-600 font-black py-4 px-8 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center"
          >
            <span className="text-2xl mr-3">🛍️</span>
            MUA NGAY - TIẾT KIỆM {discount}%
            <span className="text-2xl ml-3">⚡</span>
          </button>

          <div className="text-white text-center">
            <p className="text-sm font-semibold opacity-90">
              🔥 Đã có{" "}
              <span className="text-yellow-300 font-black">1,234+</span>{" "}
              khách hàng mua hôm nay!
            </p>
            <p className="text-xs opacity-70 mt-1">
              ⏰ Chỉ còn{" "}
              <span className="text-yellow-300 font-bold">24 giờ</span>{" "}
              nữa!
            </p>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl border-4 border-white/30 animate-pulse"></div>
    </div>
  );
};

export default DiscountBanner;