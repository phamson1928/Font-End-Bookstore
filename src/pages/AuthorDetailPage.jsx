import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { getImageUrl, getAuthorPlaceholder } from "../utils/imageUtils";
import { Footer } from "../components/user/Footer";
import { Header } from "../components/user/Header";
import { BookSection2 } from "../components/author/BookSection2";

const AuthorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Đang tải...</div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Không tìm thấy tác giả"}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const genderColor =
    author.gender === "Nam"
      ? "bg-blue-100 text-blue-800"
      : "bg-pink-100 text-pink-800";
  const avatar = getImageUrl(author.image) || getAuthorPlaceholder(400, 400);

  // Filter books by author
  const authorBooks = books.filter(book => book.author === author.name);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 space-y-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Author Image */}
              <div className="md:w-1/3 p-8 flex items-center justify-center bg-gray-100">
                <img
                  src={avatar}
                  alt={author.name}
                  className="w-64 h-64 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getAuthorPlaceholder(400, 400);
                  }}
                />
              </div>

              {/* Author Info */}
              <div className="md:w-2/3 p-8">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {author.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${genderColor}`}
                    >
                      {author.gender}
                    </span>
                    {author.age && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {author.age} tuổi
                      </span>
                    )}
                  </div>

                  {author.nationality && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg
                        className="w-5 h-5 mr-2"
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
                      <span>{author.nationality}</span>
                    </div>
                  )}

                  {author.total_work !== undefined && (
                    <div className="flex items-center text-gray-600 mb-6">
                      <svg
                        className="w-5 h-5 mr-2"
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
                      <span>{author.total_work} tác phẩm</span>
                    </div>
                  )}

                  {author.description && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Giới thiệu
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {author.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Author's Books Section */}
        {authorBooks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
            <BookSection2 books={authorBooks} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AuthorDetailPage;
