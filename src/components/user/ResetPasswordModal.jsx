export const ResetPasswordModal = ({
  isOpen,
  onClose,
  handleResetPassword,
  defaultEmail = "",
}) => {
  const modalClass = isOpen ? "show" : "hide";

  return (
    <div
      className={`modal fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 ${modalClass}`}
    >
      <div className="modal-content bg-white rounded-lg w-full max-w-md mx-4 transform translate-y-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Đặt lại mật khẩu
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={defaultEmail}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="token"
              >
                Token
              </label>
              <input
                type="text"
                id="token"
                name="token"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password_confirmation"
              >
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
