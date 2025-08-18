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
  const [books, setBooks] = useState([]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      const nextUsername = data?.user?.name || data?.user?.email || emailInput;
      setUsername(nextUsername);
      localStorage.setItem("username", nextUsername);
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
        const nextUsername = data?.user?.name || nameInput;
        setUsername(nextUsername);
        localStorage.setItem("username", nextUsername);
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
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Rehydrate auth state quickly from localStorage for correct Header UI
    const storedToken = localStorage.getItem("token");
    setIsLoggedIn(!!storedToken);
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const requests = [
          api.get("/books"),
          api.get("/categories"),
          token ? api.get("/user") : Promise.resolve(null),
        ];

        const [booksRes, categoriesRes, userRes] = await Promise.all(requests);

        // set books
        if (booksRes) setBooks(booksRes.data);

        // set categories
        if (categoriesRes) setCategories(categoriesRes.data);

        // set user info nếu có token
        if (userRes) {
          setIsLoggedIn(true);
          const nextRole = userRes.data?.user?.role || "user";
          setRole(nextRole);
          localStorage.setItem("role", nextRole);

          const nextUsername =
            userRes.data?.user?.name || userRes.data?.user?.email || "";
          if (nextUsername) {
            setUsername(nextUsername);
            localStorage.setItem("username", nextUsername);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
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
        categories={categories}
      />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection />
        {categories.map((category) => (
          <BookSection
            key={category.id ?? category._id ?? category.slug}
            id={category.id ?? category._id}
            title={category.name}
            books={filteredBooks.filter(
              (book) =>
                book.category_id === category.id ||
                book.category === category.slug ||
                book.category === category._id
            )}
            handleBookClick={handleBookClick}
          />
        ))}
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
