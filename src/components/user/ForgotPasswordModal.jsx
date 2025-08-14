export const ForgotPasswordModal = ({
  isOpen,
  onClose,
  handleForgotPassword,
}) => {
  const modalClass = isOpen ? "show" : "hide";

  return (
    <div
      className={`modal fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 ${modalClass}`}
    >
      <div className="modal-content bg-white rounded-lg w-full max-w-md mx-4 transform translate-y-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Quên mật khẩu</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="mb-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Gửi yêu cầu đặt lại
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
