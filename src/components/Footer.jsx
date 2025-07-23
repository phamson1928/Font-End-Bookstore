export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BookShopVN</h3>
            <p className="text-gray-300 mb-4">
              Cửa hàng sách trực tuyến hàng đầu Việt Nam với hàng ngàn đầu sách
              chất lượng.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-400">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-blue-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-blue-400">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-blue-400">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Hướng dẫn mua hàng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Danh mục sách</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Sách văn học
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Sách kinh tế
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Sách thiếu nhi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Sách ngoại ngữ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Sách tham khảo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-gray-400"></i>
                <span>123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-gray-400"></i>
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-gray-400"></i>
                <span>contact@bookshopvn.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3 text-gray-400"></i>
                <span>8:00 - 21:00, Thứ 2 - Chủ nhật</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2023 BookShopVN. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};
