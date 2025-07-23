export const BookCard = ({ book, onClick }) => {
  const discountPercent = Math.round(
    ((book.oldPrice - book.price) / book.oldPrice) * 100
  );

  return (
    <div
      className="book-card bg-white rounded-lg overflow-hidden shadow-md hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-gray-800 font-medium text-sm mb-1 line-clamp-2 h-10">
          {book.title}
        </h3>
        <p className="text-gray-600 text-xs mb-2">{book.author}</p>
        <div className="flex items-center">
          <span className="text-red-600 font-bold">
            {book.price.toLocaleString()}đ
          </span>
          {book.oldPrice > book.price && (
            <span className="text-gray-500 text-sm line-through ml-2">
              {book.oldPrice.toLocaleString()}đ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
