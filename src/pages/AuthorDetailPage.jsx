import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { getImageUrl, getAuthorPlaceholder } from "../utils/imageUtils";
import { Footer } from "../components/user/Footer";
import { Header } from "../components/user/Header";
import { BookSection2 } from "../components/author/BookSection2";
import { BookDetailModal } from "../components/user/BookDetailModal";

const AuthorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookDetail, setShowBookDetail] = useState(false);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowBookDetail(true);
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await api.get(`/authors/${id}`);
        setAuthor(response.data);
      } catch (e) {
        setError(e?.response?.data?.message || "Không tìm thấy tác giả");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(`/books`);
        setBooks(response.data);
      } catch (e) {
        setError(e?.response?.data?.message || "Không tìm thấy sách");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "0.8s",
              }}
            ></div>
          </div>
          <p className="text-xl font-semibold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
            Đang tải thông tin tác giả...
          </p>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 max-w-md mx-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {error || "Không tìm thấy tác giả"}
          </h2>
          <p className="text-slate-600 mb-6">
            Tác giả này có thể đã được xóa hoặc không tồn tại.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                     text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-xl"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const genderColor =
    author.gender === "Nam"
      ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
      : "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border border-pink-200";

  if (!author) return null;

  const avatar = getImageUrl(author.image) || getAuthorPlaceholder(400, 400);

  // Filter books by author
  const authorBooks = books.filter((book) => book.author === author.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="container mx-auto px-4 py-16 relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50">
              <div className="lg:flex">
                {/* Author Image */}
                <div className="lg:w-2/5 p-8 lg:p-12 flex items-center justify-center bg-gradient-to-br from-slate-100/50 to-blue-100/50">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-2xl"></div>
                    <div className="relative">
                      <img
                        src={avatar}
                        alt={author.name}
                        className="w-72 h-72 rounded-full object-cover border-8 border-white shadow-2xl 
                                 transform transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getAuthorPlaceholder(400, 400);
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>

                {/* Author Info */}
                <div className="lg:w-3/5 p-8 lg:p-12">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
                        {author.name}
                      </h1>

                      <div className="flex flex-wrap gap-4 mb-6">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${genderColor}`}
                        >
                          {author.gender}
                        </span>
                        {author.age && (
                          <span
                            className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border border-slate-300 
                                         rounded-full text-sm font-semibold shadow-sm"
                          >
                            {author.age} tuổi
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {author.nationality && (
                        <div className="flex items-center text-slate-700 bg-white/70 rounded-2xl p-4 shadow-sm border border-white/50">
                          <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl mr-4">
                            <svg
                              className="w-6 h-6 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 font-medium">
                              Quốc tịch
                            </p>
                            <p className="font-semibold">
                              {author.nationality}
                            </p>
                          </div>
                        </div>
                      )}

                      {author.total_work !== undefined && (
                        <div className="flex items-center text-slate-700 bg-white/70 rounded-2xl p-4 shadow-sm border border-white/50">
                          <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl mr-4">
                            <svg
                              className="w-6 h-6 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 font-medium">
                              Tác phẩm
                            </p>
                            <p className="font-semibold">
                              {author.total_work} tác phẩm
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {author.description && (
                      <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                          <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl mr-3">
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          Giới thiệu
                        </h3>
                        <p className="text-slate-700 leading-relaxed font-medium text-lg">
                          {author.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author's Books Section */}
        {authorBooks.length > 0 && (
          <div className="container mx-auto px-4 py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent mb-2">
                  Tác phẩm của {author.name}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              <BookSection2
                books={authorBooks}
                handleBookClick={handleBookClick}
              />
            </div>
          </div>
        )}

        <BookDetailModal
          isOpen={showBookDetail}
          onClose={() => setShowBookDetail(false)}
          book={selectedBook}
        />
      </main>

      <Footer />
    </div>
  );
};

export default AuthorDetailPage;
