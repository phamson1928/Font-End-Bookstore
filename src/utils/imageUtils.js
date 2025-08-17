// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // If it's a relative path, construct full URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  return `${baseUrl.replace("/api", "")}/storage/${imagePath}`;
};

// Default placeholder images
export const getBookPlaceholder = (width = 200, height = 300) => {
  return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"%3E%3Crect width="${width}" height="${height}" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="%236b7280"%3E📖%3C/text%3E%3C/svg%3E`;
};

export const getAuthorPlaceholder = (width = 200, height = 200) => {
  return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"%3E%3Crect width="${width}" height="${height}" fill="%23e0e7ff"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="%23333"%3E👤%3C/text%3E%3C/svg%3E`;
};
