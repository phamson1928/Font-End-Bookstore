import { BookCard } from "./BookCard";

export const BookSection = ({ id, title, books, handleBookClick }) => {
  return (
    <section id={id} className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      {books.length === 0 && (
        <p className="text-gray-600 text-center">
          Sách của danh mục này sẽ sớm được cập nhật
        </p>
      )}

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
