import { useState, useEffect } from "react";

export const AuthorForm = ({
  author: initialAuthor,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Nam",
    image: "",
    description: "",
    nationality: "",
    total_work: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  // Reset form khi initialAuthor thay đổi (khi chuyển giữa chế độ thêm/sửa)
  useEffect(() => {
    if (initialAuthor) {
      setFormData({
        name: initialAuthor.name || "",
        age: initialAuthor.age?.toString() || "",
        gender: initialAuthor.gender || "Nam",
        image: initialAuthor.image || "",
        description: initialAuthor.description || "",
        nationality: initialAuthor.nationality || "",
        total_work: initialAuthor.total_work?.toString() || "",
      });
      setImagePreview(
        initialAuthor.image ? getImageUrl(initialAuthor.image) : ""
      );
    } else {
      // Reset về form trống khi không có initialAuthor (chế độ thêm mới)
      setFormData({
        name: "",
        age: "",
        gender: "Nam",
        image: "",
        description: "",
        nationality: "",
        total_work: "",
      });
      setImagePreview("");
    }
  }, [initialAuthor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh hợp lệ");
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File hình ảnh không được lớn hơn 5MB");
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    // If editing, add _method=PUT for Laravel's form method spoofing
    if (initialAuthor?.id) {
      formDataToSend.append("_method", "PUT");
    }

    onSubmit(formDataToSend);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (typeof imagePath === "string" && imagePath.startsWith("http")) {
      return imagePath;
    }
    if (imagePath instanceof File) {
      return URL.createObjectURL(imagePath);
    }
    return `${import.meta.env.VITE_API_BASE_URL.replace(
      "/api",
      ""
    )}/storage/${imagePath}`;
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Tên tác giả <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                       focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                       placeholder-slate-400 text-slate-700 font-medium shadow-sm hover:shadow-md"
              required
              placeholder="Nhập tên tác giả"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Tuổi <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                       focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                       placeholder-slate-400 text-slate-700 font-medium shadow-sm hover:shadow-md"
              required
              placeholder="Nhập tuổi"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                       focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                       text-slate-700 font-medium shadow-sm hover:shadow-md"
              required
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Quốc tịch
            </label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                       focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                       placeholder-slate-400 text-slate-700 font-medium shadow-sm hover:shadow-md"
              placeholder="Nhập quốc tịch"
            />
          </div>

          <div className="space-y-2 md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700">
              Tổng tác phẩm
            </label>
            <input
              type="number"
              name="total_work"
              value={formData.total_work}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                       focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                       placeholder-slate-400 text-slate-700 font-medium shadow-sm hover:shadow-md"
              placeholder="Nhập tổng số tác phẩm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Mô tả
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 
                     focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                     placeholder-slate-400 text-slate-700 font-medium resize-none shadow-sm hover:shadow-md"
            placeholder="Nhập mô tả về tác giả"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Hình ảnh
          </label>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border-2 border-dashed border-purple-200 hover:border-purple-400 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-24 rounded-full object-cover shadow-lg border-4 border-white group-hover:shadow-xl transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-purple-100 flex items-center justify-center shadow-inner">
                    <svg
                      className="h-12 w-12 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-600 font-medium
                           file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 
                           file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-50 file:to-pink-50 
                           file:text-purple-700 hover:file:bg-gradient-to-r hover:file:from-purple-100 hover:file:to-pink-100
                           file:shadow-sm hover:file:shadow-md file:transition-all file:duration-300
                           file:cursor-pointer cursor-pointer"
                />
                <div className="mt-2 flex items-center space-x-2 text-xs text-slate-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>PNG, JPG, GIF tối đa 5MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-700 bg-white/50 hover:bg-slate-50 
                     focus:ring-4 focus:ring-slate-100 transition-all duration-200 font-medium shadow-sm hover:shadow-md
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                     text-white rounded-xl transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed 
                     disabled:transform-none flex items-center space-x-2"
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <span>
              {loading
                ? "Đang xử lý..."
                : initialAuthor
                ? "Cập nhật tác giả"
                : "Thêm tác giả"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
