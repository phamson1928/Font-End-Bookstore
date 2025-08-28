import { useEffect, useState } from "react";
import { Header } from "../components/user/Header";
import { Footer } from "../components/user/Footer";
import { api } from "../api";
import { getImageUrl, getAuthorPlaceholder } from "../utils/imageUtils";
import { useNavigate } from "react-router-dom";

const AuthorPage = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/authors");
        setAuthors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch authors", err?.response || err);
        const msg =
          err?.response?.data?.message || "Không thể tải danh sách tác giả.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const filtered = authors.filter((a) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const name = String(a.name || "").toLowerCase();
    const nation = String(a.nationality || "").toLowerCase();
    return name.includes(q) || nation.includes(q);
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={[]}
      />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Danh sách tác giả
            </h1>
            <p className="text-gray-600">
              Hiện có {filtered.length} / {authors.length} tác giả
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-700 font-medium">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy tác giả
            </h3>
            <p className="text-gray-500">Thử từ khóa khác nhé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((author) => {
              const avatar =
                getImageUrl(author.image) || getAuthorPlaceholder(96, 96);
              const genderBadge =
                author.gender === "Nam"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-pink-100 text-pink-800";

              return (
                <div
                  key={author.id || author._id || author.name}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                  onClick={() =>
                    navigate(`/authors/${author.id || author._id}`)
                  }
                >
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <img
                        src={avatar}
                        alt={author.name}
                        className="w-16 h-16 rounded-full object-cover shadow"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                          {author.name}
                        </h3>
                        <div className="mt-1 flex items-center space-x-2">
                          {author.gender && (
                            <span
                              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${genderBadge}`}
                            >
                              {author.gender}
                            </span>
                          )}
                          {author.age !== undefined && author.age !== null && (
                            <span className="text-gray-600 text-sm">
                              {author.age} tuổi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                      {author.nationality && (
                        <span className="inline-flex items-center">
                          <i className="fas fa-flag mr-1 text-gray-500"></i>
                          {author.nationality}
                        </span>
                      )}

                      <span className="inline-flex items-center">
                        <i className="fas fa-book mr-1 text-gray-500"></i>
                        {author.total_work} tác phẩm
                      </span>
                    </div>

                    {author.description && (
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {author.description}
                      </p>
                    )}
                  </div>

                  {/* Footer actions (optional) */}
                  {/* We avoid linking to author detail if route isn't set up */}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AuthorPage;
