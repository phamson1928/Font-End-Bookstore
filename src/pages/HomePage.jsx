import { useState, useEffect } from "react";
import { Header } from "../components/user/Header";
import { HeroSection } from "../components/user/HeroSection";
import { BookDetailModal } from "../components/user/BookDetailModal";
import { BookSection } from "../components/user/BookSection";
import { Footer } from "../components/user/Footer";
import { LoginModal } from "../components/user/LoginModal";
import { RegisterModal } from "../components/user/RegisterModal";
import { ForgotPasswordModal } from "../components/user/ForgotPasswordModal";
import { ResetPasswordModal } from "../components/user/ResetPasswordModal";
import { api, setToken, clearToken } from "../api";

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");

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
        "Đắc nhân tâm là quyển sách nổi tiếng nhất, bán chạy nhất và có tầm ảnh hưởng nhất của mọi thởi đại. Tác phẩm đã được chuyển ngữ sang hầu hết các thứ tiếng trên thế giới và có mặt ở hàng trăm quốc gia.",
      language: "Tiếng Việt",
      discountPrice: 120000,
      weight: "350g",
      packageSize: "20.5 x 14.5 x 1.5 cm",
      pages: 320,
      status: "Còn hàng",
      type: "Sách bìa mềm",
      category: "moi",
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
      category: "banchay",
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
      category: "thieunhi",
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
      category: "ngoaingu",
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
      category: "trinhtham",
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
      category: "vanhoc",
    },
  ];

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowBookDetail(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailInput = e.target.email?.value?.trim();
    const passwordInput = e.target.password?.value;
    if (!emailInput || !passwordInput) {
      alert("Vui lòng nhập email và password");
      return;
    }
    try {
      const { data } = await api.post("/login", {
        email: emailInput,
        password: passwordInput,
      });
      if (data?.token) {
        setToken(data.token);
      }
      setIsLoggedIn(true);
      setUsername(data?.user?.name || data?.user?.email || emailInput);
      setShowLoginModal(false);
      setRole(data?.user?.role || "user");
      localStorage.setItem("role", data?.user?.role || "user");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error("Login failed", { status, data, err });
      const serverMsg =
        typeof data === "string" ? data : data?.message || data?.error;
      alert(serverMsg || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const nameInput = e.target.name?.value?.trim();
    const passwordInput = e.target.password?.value;
    const confirmPasswordInput = e.target.password_confirmation?.value;
    const emailInput = e.target.email?.value?.trim();

    if (!nameInput || !passwordInput || !confirmPasswordInput || !emailInput) {
      alert(
        "Vui lòng nhập đầy đủ họ tên, email, name, mật khẩu và xác nhận mật khẩu"
      );
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      const { data } = await api.post("/register", {
        name: nameInput,
        password: passwordInput,
        password_confirmation: confirmPasswordInput,
        email: emailInput,
      });
      if (data?.token) {
        setToken(data.token);
        setIsLoggedIn(true);
        setUsername(data?.user?.name || nameInput);
        setShowRegisterModal(false);
        setRole(data?.user?.role || "user");
        localStorage.setItem("role", data?.user?.role || "user");
        return;
      }
      alert(data?.message || "Đăng ký thành công. Vui lòng đăng nhập.");
      setShowRegisterModal(false);
      setShowLoginModal(true);
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error("Register failed", { status, data, err });
      const serverMsg =
        typeof data === "string" ? data : data?.message || data?.error;
      alert(serverMsg || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target.email?.value?.trim();
    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }
    try {
      const { data } = await api.post("/forgot-password", { email });
      alert(
        data?.message || "Đã gửi email đặt lại mật khẩu (nếu email tồn tại)"
      );
      setResetEmail(email);
      setShowForgotPasswordModal(false);
      setShowResetPasswordModal(true);
    } catch (err) {
      const status = err?.response?.status;
      const resp = err?.response?.data;
      console.error("Forgot password failed", { status, resp, err });
      const serverMsg =
        typeof resp === "string" ? resp : resp?.message || resp?.error;
      alert(serverMsg || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const email = e.target.email?.value?.trim();
    const token = e.target.token?.value?.trim();
    const password = e.target.password?.value;
    const password_confirmation = e.target.password_confirmation?.value;
    if (!email || !token || !password || !password_confirmation) {
      alert("Vui lòng nhập đầy đủ email, token, mật khẩu và xác nhận mật khẩu");
      return;
    }
    if (password !== password_confirmation) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }
    try {
      const { data } = await api.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation,
      });
      alert(
        data?.message || "Đặt lại mật khẩu thành công. Vui lòng đăng nhập."
      );
      setShowResetPasswordModal(false);
      setShowLoginModal(true);
    } catch (err) {
      const status = err?.response?.status;
      const resp = err?.response?.data;
      console.error("Reset password failed", { status, resp, err });
      const serverMsg =
        typeof resp === "string" ? resp : resp?.message || resp?.error;
      alert(serverMsg || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setShowLoginModal(false);
    clearToken();
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sachbanchay = filteredBooks.filter(
    (book) => book.category === "banchay"
  );
  const sachmoi = filteredBooks.filter((book) => book.category === "moi");
  const sachthieunhi = filteredBooks.filter(
    (book) => book.category === "thieunhi"
  );
  const sachngoaingu = filteredBooks.filter(
    (book) => book.category === "ngoaingu"
  );
  const sachkinhte = filteredBooks.filter((book) => book.category === "kinhte");
  const sachvanhoc = filteredBooks.filter((book) => book.category === "vanhoc");
  const sachtrinhtham = filteredBooks.filter(
    (book) => book.category === "trinhtham"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api
      .get("/user")
      .then(({ data }) => {
        const nextRole = data?.user?.role || "user";
        setRole(nextRole);
        localStorage.setItem("role", nextRole);
      })
      .catch(() => {
        // If failed, keep existing role or default to user
      });
  }, []);

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
        role={role}
      />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection />

        <BookSection
          id="banchay"
          title="Bán chạy"
          books={sachbanchay}
          handleBookClick={handleBookClick}
        />
        <BookSection
          id="moi"
          title="Mới"
          books={sachmoi}
          handleBookClick={handleBookClick}
        />
        <BookSection
          id="thieunhi"
          title="Thiếu nhi"
          books={sachthieunhi}
          handleBookClick={handleBookClick}
        />
        <BookSection
          id="ngoaingu"
          title="Ngoại ngữ"
          books={sachngoaingu}
          handleBookClick={handleBookClick}
        />
        <BookSection
          id="kinhte"
          title="Kinh tế"
          books={sachkinhte}
          handleBookClick={handleBookClick}
        />
        <BookSection
          id="vanhoc"
          title="Văn học"
          books={sachvanhoc}
          handleBookClick={handleBookClick}
        />
        <BookSection
          id="trinhtham"
          title="Trinh thám"
          books={sachtrinhtham}
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
        showForgotPasswordModal={() => {
          setShowLoginModal(false);
          setShowForgotPasswordModal(true);
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

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        handleForgotPassword={handleForgotPassword}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        handleResetPassword={handleResetPassword}
        defaultEmail={resetEmail}
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

export default HomePage;
