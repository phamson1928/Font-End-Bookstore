import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

export const Header = ({
  showLoginModal,
  showRegisterModal,
  searchQuery,
  setSearchQuery,
  isLoggedIn,
  username,
  handleLogout,
  role,
  categories,
}) => {
  const { getTotalItems } = useCart();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-4">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              <i className="fas fa-book-open mr-2"></i>
              BookShopVN
            </Link>
          </div>

          <div className="w-full md:w-1/2 mb-4 md:mb-0 mr-4">
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
            {/* Authors Button */}
            <Link
              to="/authors"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className="fas fa-users mr-2"></i>
              <span className="font-small">Tác giả</span>
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Xin chào, <div className="text-blue-600">{username}</div>
                </span>
                {String(role || "").toLowerCase() === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition duration-300"
                  >
                    Admin
                  </Link>
                )}
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
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="py-3 border-t border-gray-200">
          <ul className="flex space-x-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <li key={category.id}>
                <a
                  href={`#${category.slug}`}
                  className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
