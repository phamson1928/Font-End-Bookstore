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
      // Map to flat form shape; avoid nested objects and keep image empty unless a new file is chosen
      setFormData({
        title: book.title || "",
        author: book.author || "",
        price: book.price ?? "",
        discount_price: book.discount_price ?? "",
        image: "",
        publication_date: book.publication_date || "",
        description: book.description || "",
        language: book.language || "Tiếng Việt",
        weight_in_grams: book.weight_in_grams || "",
        packaging_size_cm: book.packaging_size_cm || "",
        number_of_pages: book.number_of_pages ?? "",
        state: book.state || "Còn hàng",
        form: book.form || "Sách bìa mềm",
        category_id: book.category_id || book.category?.id || "",
      });
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

      // Chỉ append các field hợp lệ, bỏ qua nested objects hoặc metadata từ server
      const allowedKeys = [
        "title",
        "author",
        "price",
        "discount_price",
        "image",
        "publication_date",
        "description",
        "language",
        "weight_in_grams",
        "packaging_size_cm",
        "number_of_pages",
        "state",
        "form",
        "category_id",
      ];

      allowedKeys.forEach((key) => {
        const value = formData[key];
        if (value === "" || value === null || value === undefined) return;

        if (key === "image") {
          // Chỉ gửi image nếu là File mới
          if (value instanceof File) submitData.append("image", value);
          return;
        }

        if (
          key === "price" ||
          key === "discount_price" ||
          key === "number_of_pages" ||
          key === "category_id"
        ) {
          submitData.append(key, Number(value));
        } else {
          submitData.append(key, value);
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

  const FormSection = ({ title, children, icon }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mr-3">
          {icon}
        </div>
        <h4 className="font-bold text-slate-800 text-lg">{title}</h4>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const FormField = ({
    label,
    name,
    type = "text",
    required = false,
    options = null,
    ...props
  }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 
                   focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                   text-slate-700 font-medium shadow-sm hover:shadow-md ${
                     errors[name] ? "border-red-500" : "border-slate-200"
                   }`}
          required={required}
          {...props}
        >
          {options}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 
                   focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                   placeholder-slate-400 text-slate-700 font-medium resize-none shadow-sm hover:shadow-md ${
                     errors[name] ? "border-red-500" : "border-slate-200"
                   }`}
          required={required}
          {...props}
        />
      ) : type === "file" ? (
        <input
          type="file"
          name={name}
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 
                   focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                   text-slate-700 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                   file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                   shadow-sm hover:shadow-md"
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 
                   focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm
                   placeholder-slate-400 text-slate-700 font-medium shadow-sm hover:shadow-md ${
                     errors[name] ? "border-red-500" : "border-slate-200"
                   }`}
          required={required}
          {...props}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6">
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <FormSection
            title="Thông tin cơ bản"
            icon={
              <svg
                className="w-5 h-5 text-blue-600"
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
            }
          >
            <FormField
              label="Tên sách"
              name="title"
              required
              placeholder="Nhập tên sách"
            />
            <FormField
              label="Tác giả"
              name="author"
              required
              placeholder="Nhập tên tác giả"
            />
            <FormField
              label="Mô tả"
              name="description"
              type="textarea"
              rows={3}
              placeholder="Nhập mô tả sách"
            />
            <FormField
              label="Danh mục"
              name="category_id"
              type="select"
              required
              options={
                <>
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </>
              }
            />
          </FormSection>

          {/* Pricing and Status */}
          <FormSection
            title="Giá cả & Trạng thái"
            icon={
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            }
          >
            <FormField
              label="Giá cũ (VNĐ)"
              name="price"
              type="number"
              required
              min="0"
              placeholder="Nhập giá sách"
            />
            <FormField
              label="Giá khuyến mãi (VNĐ)"
              name="discount_price"
              type="number"
              min="0"
              placeholder="Nhập giá khuyến mãi"
            />
            <FormField
              label="Trạng thái"
              name="state"
              type="select"
              options={
                <>
                  <option value="Còn hàng">Còn hàng</option>
                  <option value="Hết hàng">Hết hàng</option>
                  <option value="Sắp có">Sắp có</option>
                </>
              }
            />
            <FormField
              label="Loại bìa"
              name="form"
              type="select"
              options={
                <>
                  <option value="Sách bìa mềm">Sách bìa mềm</option>
                  <option value="Sách bìa cứng">Sách bìa cứng</option>
                  <option value="Sách điện tử">Sách điện tử</option>
                </>
              }
            />
          </FormSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Additional Information */}
          <FormSection
            title="Thông tin chi tiết"
            icon={
              <svg
                className="w-5 h-5 text-purple-600"
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
            }
          >
            <FormField
              label="Ngày xuất bản"
              name="publication_date"
              type="date"
            />
            <FormField
              label="Ngôn ngữ"
              name="language"
              type="select"
              required
              options={
                <>
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Tiếng Trung">Tiếng Trung</option>
                  <option value="Tiếng Nhật">Tiếng Nhật</option>
                </>
              }
            />
            <FormField
              label="Số trang"
              name="number_of_pages"
              type="number"
              placeholder="Nhập số trang"
            />
          </FormSection>

          {/* Physical Information */}
          <FormSection
            title="Thông tin vật lý"
            icon={
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            }
          >
            <FormField
              label="Trọng lượng"
              name="weight_in_grams"
              placeholder="VD: 350g"
            />
            <FormField
              label="Kích thước"
              name="packaging_size_cm"
              placeholder="VD: 20.5 x 14.5 x 1.5 cm"
            />
            <FormField label="Hình ảnh (tải từ máy)" name="image" type="file" />
          </FormSection>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t-2 border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-700 bg-white/50 hover:bg-slate-50 
                     focus:ring-4 focus:ring-slate-100 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
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
              {loading ? "Đang xử lý..." : book ? "Cập nhật" : "Thêm sách"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
