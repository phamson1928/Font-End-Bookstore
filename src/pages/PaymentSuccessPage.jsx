import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "../components/user/Header";
import { api } from "../api";
import { CheckCircle, XCircle, Clock, ArrowLeft, Package } from "lucide-react";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState("loading");
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const appTransId = searchParams.get("apptransid");
      
      if (!appTransId) {
        setPaymentStatus("error");
        return;
      }

      try {
        const response = await api.post("/zalopay/check-status", {
          app_trans_id: appTransId
        });

        if (response.data.status === 1) {
          setPaymentStatus("success");
          setPaymentData(response.data.payment);
        } else {
          setPaymentStatus("failed");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setPaymentStatus("error");
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const renderContent = () => {
    switch (paymentStatus) {
      case "loading":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <Clock className="w-16 h-16 text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Đang kiểm tra thanh toán...
            </h2>
            <p className="text-slate-600 text-lg">
              Vui lòng chờ trong giây lát
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Thanh toán thành công!
            </h2>
            <p className="text-slate-600 text-lg mb-6">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </p>
            {paymentData && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-700">Mã đơn hàng:</p>
                    <p className="text-green-600 font-bold">#{paymentData.order_id}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Số tiền:</p>
                    <p className="text-green-600 font-bold">
                      {Number(paymentData.amount).toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "failed":
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Thanh toán thất bại
            </h2>
            <p className="text-slate-600 text-lg mb-6">
              Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <XCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-yellow-600 mb-4">
              Có lỗi xảy ra
            </h2>
            <p className="text-slate-600 text-lg mb-6">
              Không thể xác định trạng thái thanh toán. Vui lòng liên hệ hỗ trợ.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-12">
            {renderContent()}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/history-orders"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Package className="w-5 h-5 mr-2" />
                Xem đơn hàng
              </Link>
              
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;