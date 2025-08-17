import { useState, useEffect } from "react";

export const BookForm = ({
  book,
  handleAddBook,
  handleEditBook,
  onCancel,
  categories,
  loading = true,
}) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    discount_price: "",
    // quantity: "",
    image: "",
    publication_date: "",
    description: "",
    language: "Tiếng Việt",
    weight_in_grams: "",
    packaging_size_cm: "",
    number_of_pages: "",
    state: "Còn hàng",
    form: "Sách bìa mềm",
    category_id: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      price: "",
      discount_price: "",
      image: "",
      publication_date: "",
      description: "",
      language: "Tiếng Việt",
      weight_in_grams: "",
      packaging_size_cm: "",
      number_of_pages: "",
      state: "Còn hàng",
      form: "Sách bìa mềm",
      category_id: "",
    });
    setErrors({});
  };

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      resetForm();
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Xử lý đặc biệt cho các trường số
    let processedValue = value;
    if (
      name === "price" ||
      name === "discount_price" ||
      name === "number_of_pages"
    ) {
      // Chỉ cho phép số và không âm
      if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
        processedValue = value;
      } else {
        return; // Không cập nhật nếu giá trị không hợp lệ
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh hợp lệ");
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File hình ảnh không được lớn hơn 5MB");
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      const newErrors = {};
      if (!formData.title) newErrors.title = "Tên sách là bắt buộc";
      if (!formData.author) newErrors.author = "Tác giả là bắt buộc";
      if (!formData.price) newErrors.price = "Giá là bắt buộc";
      if (!formData.category_id) newErrors.category_id = "Danh mục là bắt buộc";
      if (!formData.language) newErrors.language = "Ngôn ngữ là bắt buộc";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});

      // Tạo FormData để xử lý file upload
      const submitData = new FormData();

      // Thêm tất cả các field vào FormData
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== "" &&
          formData[key] !== null &&
          formData[key] !== undefined
        ) {
          if (key === "image" && formData[key] instanceof File) {
            submitData.append(key, formData[key]);
          } else {
            // Đảm bảo các giá trị số được chuyển đổi đúng
            if (
              key === "price" ||
              key === "discount_price" ||
              key === "number_of_pages"
            ) {
              submitData.append(key, Number(formData[key]));
            } else if (key === "category_id") {
              submitData.append(key, Number(formData[key]));
            } else {
              submitData.append(key, formData[key]);
            }
          }
        }
      });

      // Log FormData để debug
      console.log("Submitting FormData:");
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      // Gọi function tương ứng
      if (book) {
        await handleEditBook(submitData, e);
      } else {
        await handleAddBook(submitData, e);
        // Reset form sau khi thêm thành công
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Có lỗi xảy ra khi gửi form. Vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Thông tin cơ bản</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sách *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tác giả *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.author ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1">{errors.author}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category_id ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <>
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </>
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
            )}
          </div>
        </div>

        {/* Pricing and Status */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Giá cả & Trạng thái</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá cũ (VNĐ) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              required
              min="0"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá khuyến mãi (VNĐ)
            </label>
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min="0"
              placeholder="Nhập số lượng sách"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              name="state"
              value={formData.state || "Còn hàng"}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Còn hàng">Còn hàng</option>
              <option value="Hết hàng">Hết hàng</option>
              <option value="Sắp có">Sắp có</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại bìa
            </label>
            <select
              name="form"
              value={formData.form || "Sách bìa mềm"}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Sách bìa mềm">Sách bìa mềm</option>
              <option value="Sách bìa cứng">Sách bìa cứng</option>
              <option value="Sách điện tử">Sách điện tử</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Thông tin chi tiết</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày xuất bản
            </label>
            <input
              type="date"
              name="publication_date"
              value={formData.publication_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngôn ngữ
            </label>
            <select
              name="language"
              value={formData.language || "Tiếng Việt"}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.language ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
              <option value="Tiếng Trung">Tiếng Trung</option>
              <option value="Tiếng Nhật">Tiếng Nhật</option>
            </select>
            {errors.language && (
              <p className="text-red-500 text-sm mt-1">{errors.language}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số trang
            </label>
            <input
              type="number"
              name="number_of_pages"
              value={formData.number_of_pages}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Thông tin vật lý</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trọng lượng
            </label>
            <input
              type="text"
              name="weight_in_grams"
              value={formData.weight_in_grams}
              onChange={handleChange}
              placeholder="VD: 350g"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kích thước
            </label>
            <input
              type="text"
              name="packaging_size_cm"
              value={formData.packaging_size_cm}
              onChange={handleChange}
              placeholder="VD: 20.5 x 14.5 x 1.5 cm"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh (tải từ máy)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang xử lý..." : book ? "Cập nhật" : "Thêm sách"}
        </button>
      </div>
    </form>
  );
};
