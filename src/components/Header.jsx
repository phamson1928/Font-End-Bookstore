export const Header = ({
  showLoginModal,
  showRegisterModal,
  searchQuery,
  setSearchQuery,
  isLoggedIn,
  username,
  handleLogout,
}) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-4">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-blue-600">
              <i className="fas fa-book-open mr-2"></i>
              BookShopVN
            </h1>
          </div>

          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sách, tác giả..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-0 top-0 h-full px-4 text-blue-600">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Xin chào, {username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={showLoginModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={showRegisterModal}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Đăng ký
                </button>
              </>
            )}
            <button className="relative p-2 text-gray-700 hover:text-blue-600">
              <i className="fas fa-shopping-cart text-xl"></i>
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </button>
          </div>
        </div>

        <nav className="py-3 border-t border-gray-200">
          <ul className="flex space-x-6 overflow-x-auto pb-2">
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
              >
                Sách mới
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
              >
                Sách bán chạy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
              >
                Sách giảm giá
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
              >
                Sách thiếu nhi
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
              >
                Sách ngoại ngữ
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
              >
                Sách kinh tế
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
              >
                Sách văn học
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
