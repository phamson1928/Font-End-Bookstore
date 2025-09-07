import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import NotificationBell from "./NotificationBell";

export const Header = ({
  showLoginModal = () => {},
  showRegisterModal = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
  isLoggedIn = false,
  username = "",
  handleLogout = () => {
    // Safe default logout behavior when not provided by parent
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/";
  },
  role = "",
  categories = [],
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Simulate loading state for auth check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };
  const { getTotalItems } = useCart();

  // Derive auth state from localStorage when parent does not pass values
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const storedUsername =
    typeof window !== "undefined" ? localStorage.getItem("username") || "" : "";
  const storedRole =
    typeof window !== "undefined" ? localStorage.getItem("role") || "" : "";

  const isLoggedInEffective = isLoggedIn || !!token;
  const usernameEffective = username || storedUsername;
  const roleEffective = role || storedRole;

  if (isLoading) {
    return (
      <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between py-4">
            <div className="flex items-center mb-4 lg:mb-0">
              <div className="h-8 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl animate-pulse"></div>
            </div>
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0 mx-4">
              <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl animate-pulse"></div>
              <div className="h-10 w-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl animate-pulse"></div>
              <div className="h-10 w-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="py-4 border-t border-slate-200">
            <div className="flex space-x-6 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-6 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`bg-white/95 backdrop-blur-md shadow-xl border-b border-white/20 sticky top-0 z-50 
                      transition-all duration-300 ${
                        isScrolled ? "shadow-2xl bg-white/98" : ""
                      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center mb-4 lg:mb-0">
            <Link to="/" className="group flex items-center">
              <div className="relative">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg 
                              opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                ></div>
                <div
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl 
                              transform transition-transform duration-300 group-hover:scale-110"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <span
                className="ml-3 text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 
                             bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 
                             transition-all duration-300"
              >
                BookShopVN
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-full lg:w-1/3 mb-4 lg:mb-0 mx-4">
            <div className="relative group">
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              ></div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sách, tác giả..."
                  className="w-full px-6 py-3 pl-6 pr-14 border-2 border-slate-200 rounded-2xl 
                           focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
                           transition-all duration-300 bg-white/80 backdrop-blur-sm
                           placeholder-slate-400 text-slate-700 font-medium shadow-lg hover:shadow-xl
                           group-hover:border-blue-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 
                                 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                                 text-white p-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl
                                 hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {isLoggedInEffective && <NotificationBell />}
            {isLoggedInEffective ? (
              <div className="flex items-center space-x-4">
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 
                             hover:from-slate-100 hover:to-slate-200 rounded-xl border border-slate-200 
                             transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={toggleDropdown}
                  >
                    <div
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full 
                                  flex items-center justify-center text-white font-bold text-sm"
                    >
                      {usernameEffective.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-700 font-medium">
                      {usernameEffective}
                    </span>
                    <svg
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 
                                   ${showDropdown ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div
                      className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl 
                                  shadow-2xl border border-white/50 py-2 z-50 transform transition-all duration-200 
                                  animate-in slide-in-from-top-2"
                    >
                      <Link
                        to="/history-order"
                        className="flex items-center px-4 py-3 text-slate-700 hover:bg-gradient-to-r 
                                 hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200
                                 font-medium"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Lịch sử đơn hàng
                      </Link>
                    </div>
                  )}
                </div>

                {/* Authors Button */}
                <Link
                  to="/authors"
                  className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 
                           text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 
                           shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Tác giả
                </Link>

                {/* Admin Button */}
                {String(roleEffective || "").toLowerCase() === "admin" && (
                  <Link
                    to="/admin"
                    className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 
                             text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 
                             shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Admin
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                           text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 
                           shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={showLoginModal}
                  className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                           text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 
                           shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={showRegisterModal}
                  className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                           text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 
                           shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Đăng ký
                </button>
              </>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="group relative p-3 text-slate-700 hover:text-blue-600 bg-gradient-to-r from-slate-50 to-slate-100 
                       hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 
                       shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg
                className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 18a2 2 0 11-4 0 2 2 0 014 0zM9 18a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {getTotalItems() > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white 
                               rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold
                               shadow-lg animate-pulse"
                >
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="py-4 border-t border-slate-200/50">
          <ul className="flex space-x-8 overflow-x-auto pb-2">
            {isLoading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <li key={i}>
                    <div className="h-6 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
                  </li>
                ))
              : categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`#${category.id}`}
                      className="group relative text-slate-700 hover:text-blue-600 whitespace-nowrap 
                               font-medium transition-all duration-300 py-2 px-1"
                    >
                      <span className="relative z-10">{category.name}</span>
                      <div
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 
                                    group-hover:w-full transition-all duration-300 rounded-full"
                      ></div>
                    </a>
                  </li>
                ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
