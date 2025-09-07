import { getImageUrl, getBookPlaceholder } from "../../utils/imageUtils";

export const BookCard = ({ book, onClick }) => {
  const discountPercent = Math.round(
    ((book.price - book.discount_price) / book.price) * 100
  );

  const colorBgState = () => {
    switch (book.state) {
      case "Còn hàng":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "Hết hàng":
        return "bg-gradient-to-r from-red-500 to-red-600";
      default:
        return "bg-gradient-to-r from-yellow-500 to-orange-600";
    }
  };

  return (
    <div
      className="book-card group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
                 transition-all duration-300 transform hover:scale-105 hover:cursor-pointer border border-white/50
                 relative"
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-purple-600/0 group-hover:from-blue-400/5 
                      group-hover:to-purple-600/5 transition-all duration-300 rounded-2xl z-10 pointer-events-none"
      ></div>

      <div className="relative">
        <div className="overflow-hidden rounded-t-2xl">
          <img
            src={getImageUrl(book.image) || getBookPlaceholder(200, 300)}
            alt={book.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = getBookPlaceholder(200, 300);
            }}
          />
        </div>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-20">
            <div
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 
                           rounded-full shadow-lg transform rotate-3 animate-pulse"
            >
              -{discountPercent}%
            </div>
          </div>
        )}

        {/* Decorative corner element */}
        <div
          className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-transparent 
                        rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
      </div>

      <div className="p-5 relative z-20">
        {/* Title with better typography */}
        <h3
          className="text-slate-800 font-bold text-base mb-2 line-clamp-2 h-12 group-hover:text-blue-700 
                       transition-colors duration-200 leading-tight"
        >
          {book.title}
        </h3>

        {/* Author with enhanced styling */}
        <p className="text-slate-500 text-sm mb-4 font-medium flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-slate-400"
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
          {book.author}
        </p>

        {/* Price section with enhanced design */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-red-600 font-bold text-lg flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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
              <span className="text-slate-400 text-sm line-through">
                đ{Number(book.price).toLocaleString("vi-VN")}
              </span>
            )}
          </div>

          {/* Status badge with enhanced styling */}
          <div
            className={`px-3 py-1.5 rounded-full shadow-lg transform transition-all duration-200 
                       group-hover:scale-105 ${colorBgState()}`}
          >
            <span className="text-white text-xs font-semibold tracking-wide">
              {book.state}
            </span>
          </div>
        </div>

        {/* Subtle bottom decoration */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 
                        bg-gradient-to-r from-transparent via-blue-300 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        ></div>
      </div>

      {/* Card border glow effect */}
      <div
        className="absolute inset-0 rounded-2xl border-2 border-transparent 
                      group-hover:border-blue-200 transition-all duration-300 pointer-events-none"
      ></div>
    </div>
  );
};
