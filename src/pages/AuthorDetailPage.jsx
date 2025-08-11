import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/user/Header";
import { Footer } from "../components/user/Footer";
import { BookCard } from "../components/user/BookCard";
import { BookDetailModal } from "../components/user/BookDetailModal";

const AuthorDetailPage = () => {
  const { authorName } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Mock data - in real app, this would come from API
  const mockAuthors = [
    {
      id: 1,
      name: "Nguyễn Nhật Ánh",
      age: 65,
      gender: "Nam",
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e0e7ff'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ENNÁ%3C/text%3E%3C/svg%3E",
      description:
        "Nhà văn nổi tiếng với nhiều tác phẩm dành cho thiếu nhi và thanh thiếu niên. Ông được biết đến với phong cách viết giản dị, gần gũi và đầy cảm xúc.",
      booksCount: 25,
      joinDate: "2020-01-15",
    },
    {
      id: 2,
      name: "Dale Carnegie",
      age: 77,
      gender: "Nam",
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23fef3c7'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3EDC%3C/text%3E%3C/svg%3E",
      description:
        "Tác giả của cuốn sách nổi tiếng 'Đắc Nhân Tâm' và nhiều tác phẩm về phát triển bản thân. Ông là một trong những tác giả có ảnh hưởng lớn nhất trong lĩnh vực tự phát triển.",
      booksCount: 12,
      joinDate: "2019-03-20",
    },
    {
      id: 3,
      name: "Paulo Coelho",
      age: 76,
      gender: "Nam",
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23dcfce7'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3EPC%3C/text%3E%3C/svg%3E",
      description:
        "Nhà văn Brazil nổi tiếng với tác phẩm 'Nhà Giả Kim' và nhiều tiểu thuyết triết lý. Tác phẩm của ông đã được dịch ra hơn 80 ngôn ngữ trên thế giới.",
      booksCount: 18,
      joinDate: "2019-07-10",
    },
    {
      id: 4,
      name: "Tony Buổi Sáng",
      age: 45,
      gender: "Nam",
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23fed7d7'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ETBS%3C/text%3E%3C/svg%3E",
      description:
        "Tác giả của nhiều cuốn sách về kinh doanh và phát triển bản thân. Được biết đến với phong cách viết thực tế và dễ hiểu.",
      booksCount: 15,
      joinDate: "2020-08-22",
    },
  ];

  // Mock books data
  const mockBooks = [
    {
      id: 1,
      title: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      price: 120000,
      oldPrice: 150000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23f8d775'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3EĐắc Nhân Tâm%3C/text%3E%3C/svg%3E",
      description: "Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử.",
      category: "kynang",
    },
    {
      id: 2,
      title: "Nhà Giả Kim",
      author: "Paulo Coelho",
      price: 79000,
      oldPrice: 99000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23a7f3d0'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ENhà Giả Kim%3C/text%3E%3C/svg%3E",
      description:
        "Câu chuyện về hành trình tìm kiếm ước mơ của chàng chăn cừu Santiago.",
      category: "vanhoc",
    },
    {
      id: 5,
      title: "Cà Phê Cùng Tony",
      author: "Tony Buổi Sáng",
      price: 90000,
      oldPrice: 120000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23fed7d7'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ECà Phê Cùng Tony%3C/text%3E%3C/svg%3E",
      description: "Những chia sẻ về cuộc sống và kinh doanh qua tách cà phê.",
      category: "kynang",
    },
    {
      id: 6,
      title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
      author: "Nguyễn Nhật Ánh",
      price: 85000,
      oldPrice: 110000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23e0e7ff'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ETôi Thấy Hoa Vàng%3C/text%3E%3C/svg%3E",
      description: "Tác phẩm kinh điển về tuổi thơ miền quê Việt Nam.",
      category: "vanhoc",
    },
  ];

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        // Find author by name
        const foundAuthor = mockAuthors.find(
          (a) =>
            a.name.toLowerCase() ===
            decodeURIComponent(authorName).toLowerCase()
        );

        if (foundAuthor) {
          setAuthor(foundAuthor);

          // Get books by this author
          const books = mockBooks.filter(
            (book) =>
              book.author.toLowerCase() === foundAuthor.name.toLowerCase()
          );
          setAuthorBooks(books);
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authorName) {
      fetchAuthorData();
    }
  }, [authorName]);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowBookDetail(true);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin tác giả...</p>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy tác giả
          </h2>
          <p className="text-gray-600 mb-6">
            Tác giả "{decodeURIComponent(authorName)}" không tồn tại trong hệ
            thống.
          </p>
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToHome}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Quay về trang chủ
        </button>

        {/* Author Profile Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center">
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-48 h-48 rounded-full mx-auto mb-6 shadow-lg object-cover"
                />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {author.name}
                </h1>
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      author.gender === "Nam"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pink-100 text-pink-800"
                    }`}
                  >
                    {author.gender}
                  </span>
                  <span className="text-gray-600">
                    <i className="fas fa-birthday-cake mr-1"></i>
                    {author.age} tuổi
                  </span>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Giới thiệu về tác giả
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {author.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {author.booksCount}
                  </div>
                  <div className="text-gray-600 text-sm">Tác phẩm</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {authorBooks.length}
                  </div>
                  <div className="text-gray-600 text-sm">Sách có sẵn</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {new Date(author.joinDate).getFullYear()}
                  </div>
                  <div className="text-gray-600 text-sm">Năm tham gia</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Sách của {author.name}
            </h2>
            <span className="text-gray-600">
              {authorBooks.length} cuốn sách
            </span>
          </div>

          {authorBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {authorBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => handleBookClick(book)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có sách nào
              </h3>
              <p className="text-gray-500">
                Hiện tại chưa có sách nào của tác giả này trong cửa hàng.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Book Detail Modal */}
      <BookDetailModal
        isOpen={showBookDetail}
        onClose={() => setShowBookDetail(false)}
        book={selectedBook}
      />
    </div>
  );
};

export default AuthorDetailPage;
