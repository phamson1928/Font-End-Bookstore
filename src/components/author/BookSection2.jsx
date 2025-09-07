import { BookCard } from "../user/BookCard";
import { AnimatedBookItem } from "../user/AnimatedBookItem";

export const BookSection2 = ({ books = [], handleBookClick }) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Tác phẩm ({books.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <AnimatedBookItem key={book.id} index={books.indexOf(book)}>
            <div className="transform transition-transform hover:scale-105 h-full">
              <BookCard book={book} onClick={() => handleBookClick(book)} />
            </div>
          </AnimatedBookItem>
        ))}
      </div>
    </div>
  );
};
