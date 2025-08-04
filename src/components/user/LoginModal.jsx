export const LoginModal = ({
  isOpen,
  onClose,
  handleLogin,
  showRegisterModal,
}) => {
  const modalClass = isOpen ? "show" : "hide";

  return (
    <div
      className={`modal fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 ${modalClass}`}
    >
      <div className="modal-content bg-white rounded-lg w-full max-w-md mx-4 transform -translate-y-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Đăng nhập</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="username"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <input
                type="text"
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Chưa có tài khoản?
              <button
                onClick={showRegisterModal}
                className="text-blue-600 hover:underline ml-1"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
