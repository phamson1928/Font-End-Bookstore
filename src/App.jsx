import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import AuthorDetailPage from "./pages/AuthorDetailPage";
import { useEffect } from "react";
import api from "./api/client";

const App = () => {
  // Tạo ping server để cập nhật trạng thái online
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const pingServer = async () => {
      try {
        await api.post("/ping", {});
        console.log("✅ User online status updated");
      } catch (error) {
        console.error(
          "❌ Failed to update online status:",
          error.response?.status,
          error.response?.data
        );
      }
    };
    pingServer();
    const pingInterval = setInterval(pingServer, 2 * 60 * 1000);
    return () => clearInterval(pingInterval);
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/author/:authorName" element={<AuthorDetailPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
