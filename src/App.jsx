import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { BookDetailModal } from "./components/BookDetailModal";
import { BookSection } from "./components/BookSection";
import { Footer } from "./components/Footer";
import { LoginModal } from "./components/LoginModal";
import { RegisterModal } from "./components/RegisterModal";

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Sample book data
  const books = [
    {
      id: 1,
      title: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      price: 120000,
      oldPrice: 150000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23f8d775'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3EĐắc Nhân Tâm%3C/text%3E%3C/svg%3E",
      publishDate: "01/01/2020",
      description:
        "Đắc nhân tâm là quyển sách nổi tiếng nhất, bán chạy nhất và có tầm ảnh hưởng nhất của mọi thời đại. Tác phẩm đã được chuyển ngữ sang hầu hết các thứ tiếng trên thế giới và có mặt ở hàng trăm quốc gia.",
      language: "Tiếng Việt",
      discountPrice: 120000,
      weight: "350g",
      packageSize: "20.5 x 14.5 x 1.5 cm",
      pages: 320,
      status: "Còn hàng",
      type: "Sách bìa mềm",
      category: "bestseller",
    },
    {
      id: 2,
      title: "Nhà Giả Kim",
      author: "Paulo Coelho",
      price: 79000,
      oldPrice: 99000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23a2d2ff'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ENhà Giả Kim%3C/text%3E%3C/svg%3E",
      publishDate: "15/05/2019",
      description:
        "Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, hòa hợp với vũ trụ và con người.",
      language: "Tiếng Việt",
      discountPrice: 79000,
      weight: "280g",
      packageSize: "20 x 14 x 1.2 cm",
      pages: 228,
      status: "Còn hàng",
      type: "Sách bìa mềm",
      category: "bestseller",
    },
    {
      id: 3,
      title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
      author: "Rosie Nguyễn",
      price: 85000,
      oldPrice: 100000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23ffafcc'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ETuổi Trẻ Đáng Giá Bao Nhiêu%3C/text%3E%3C/svg%3E",
      publishDate: "20/08/2018",
      description:
        "Tuổi trẻ đáng giá bao nhiêu? được tác giả chia làm 3 phần: HỌC, LÀM, ĐI. Đây là ba việc quan trọng nhất của một đời người.",
      language: "Tiếng Việt",
      discountPrice: 85000,
      weight: "300g",
      packageSize: "20.5 x 14 x 1.3 cm",
      pages: 285,
      status: "Còn hàng",
      type: "Sách bìa mềm",
      category: "trending",
    },
    {
      id: 4,
      title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
      author: "Nguyễn Nhật Ánh",
      price: 110000,
      oldPrice: 125000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23bde0fe'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ETôi Thấy Hoa Vàng Trên Cỏ Xanh%3C/text%3E%3C/svg%3E",
      publishDate: "10/12/2018",
      description:
        "Tôi thấy hoa vàng trên cỏ xanh là một tiểu thuyết dành cho thanh thiếu niên của nhà văn Nguyễn Nhật Ánh, xuất bản lần đầu tại Việt Nam vào ngày 9 tháng 12 năm 2010.",
      language: "Tiếng Việt",
      discountPrice: 110000,
      weight: "350g",
      packageSize: "21 x 15 x 1.5 cm",
      pages: 378,
      status: "Còn hàng",
      type: "Sách bìa mềm",
      category: "trending",
    },
    {
      id: 5,
      title: "Cà Phê Cùng Tony",
      author: "Tony Buổi Sáng",
      price: 90000,
      oldPrice: 120000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23cdb4db'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ECà Phê Cùng Tony%3C/text%3E%3C/svg%3E",
      publishDate: "05/03/2017",
      description:
        "Cà Phê Cùng Tony là tập hợp những bài viết được yêu thích trên Facebook của Tony Buổi Sáng. Đúng như tên gọi, mỗi bài nhẹ nhàng như một tách cà phê, mang đến những bài học, câu chuyện về kinh nghiệm sống, về sự trưởng thành.",
      language: "Tiếng Việt",
      discountPrice: 90000,
      weight: "320g",
      packageSize: "20.5 x 14.5 x 1.4 cm",
      pages: 268,
      status: "Còn hàng",
      type: "Sách bìa mềm",
      category: "bestseller",
    },
    {
      id: 6,
      title: "Sapiens: Lược Sử Loài Người",
      author: "Yuval Noah Harari",
      price: 189000,
      oldPrice: 219000,
      image:
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23ffd166'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3ESapiens: Lược Sử Loài Người%3C/text%3E%3C/svg%3E",
      publishDate: "12/09/2019",
      description:
        "Sapiens là một câu chuyện lớn về cách chúng ta, loài người, đã đi từ việc là một loài thú không đáng chú ý ở châu Phi đến vị thế thống trị của chúng ta ngày nay.",
      language: "Tiếng Việt",
      discountPrice: 189000,
      weight: "550g",
      packageSize: "24 x 16 x 2.5 cm",
      pages: 560,
      status: "Còn hàng",
      type: "Sách bìa cứng",
      category: "trending",
    },
  ];

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowBookDetail(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    setIsLoggedIn(true);
    setUsername(e.target.username.value);
    setShowLoginModal(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate registration
    setIsLoggedIn(true);
    setUsername(e.target.username.value);
    setShowRegisterModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bestSellerBooks = filteredBooks.filter(
    (book) => book.category === "bestseller"
  );
  const trendingBooks = filteredBooks.filter(
    (book) => book.category === "trending"
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header Component */}
      <Header
        showLoginModal={() => setShowLoginModal(true)}
        showRegisterModal={() => setShowRegisterModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn}
        username={username}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Best Seller Section */}
        <BookSection
          title="Best Seller"
          books={bestSellerBooks}
          handleBookClick={handleBookClick}
        />

        {/* Trending Section */}
        <BookSection
          title="Trending"
          books={trendingBooks}
          handleBookClick={handleBookClick}
        />
      </main>

      {/* Footer Component */}
      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        handleLogin={handleLogin}
        showRegisterModal={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        handleRegister={handleRegister}
        showLoginModal={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* Book Detail Modal */}
      <BookDetailModal
        isOpen={showBookDetail}
        onClose={() => setShowBookDetail(false)}
        book={selectedBook}
      />
    </div>
  );
};

export default App;
