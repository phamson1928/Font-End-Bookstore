import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import AuthorPage from "./pages/AuthorPage";
import AuthorDetailPage from "./pages/AuthorDetailPage";
import HistoryOrder from "./pages/HistoryOrderPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
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
          <Route path="/authors" element={<AuthorPage />} />
          <Route path="/authors/:id" element={<AuthorDetailPage />} />
          <Route path="/history-order" element={<HistoryOrder />} />
          <Route path="/history-orders" element={<HistoryOrder />} />
          <Route path="/thong-bao" element={<NotificationsPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </CartProvider>
  );
};

export default App;
