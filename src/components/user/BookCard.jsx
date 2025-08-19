import { getImageUrl, getBookPlaceholder } from "../../utils/imageUtils";

export const BookCard = ({ book, onClick }) => {
  const discountPercent = Math.round(
    ((book.price - book.discount_price) / book.price) * 100
  );
  const colorBgState = () => {
    switch (book.state) {
      case "Còn hàng":
        return "bg-green-500";
      case "Hết hàng":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div
      className="book-card bg-white rounded-lg overflow-hidden shadow-md hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={getImageUrl(book.image) || getBookPlaceholder(200, 300)}
          alt={book.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = getBookPlaceholder(200, 300);
          }}
        />
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-gray-800 font-bold text-base mb-1 line-clamp-2 h-10">
          {book.title}
        </h3>
        <p className="text-gray-600 text-xs mb-2">{book.author}</p>
        <div className="flex items-center">
          <span className="text-red-600 font-bold">
            đ{Number(book.discount_price).toLocaleString("vi-VN")}
          </span>
          {book.price > book.discount_price && (
            <span className="text-gray-500 text-sm line-through ml-2">
              đ{Number(book.price).toLocaleString("vi-VN")}
            </span>
          )}
          <div
            className={`ml-auto w-18 h-6 rounded-2xl flex items-center justify-center ${colorBgState()}`}
          >
            <span className="text-white text-xs">{book.state}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
