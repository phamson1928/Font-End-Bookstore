import { BookCard } from "./BookCard";

export const BookSection = ({ title, books, handleBookClick }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <a href="#" className="text-blue-600 hover:underline flex items-center">
          Xem tất cả <i className="fas fa-chevron-right ml-1 text-sm"></i>
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => handleBookClick(book)}
          />
        ))}
      </div>
    </section>
  );
};
