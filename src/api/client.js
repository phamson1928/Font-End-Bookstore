import axios from "axios";

// Base URL is read from Vite env. Provide a sensible local default for dev.
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  // Do not set a global Content-Type; let interceptors decide per request
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      
      // Add CSRF token for non-GET requests
      const method = config.method?.toLowerCase();
      if (method && method !== 'get') {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        if (csrfToken) {
          config.headers['X-CSRF-TOKEN'] = csrfToken;
        }
      }
    }

    // Ensure correct Content-Type handling
    config.headers = config.headers || {};
    if (config.data instanceof FormData) {
      // Let the browser set multipart boundaries
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    } else {
      // Default to JSON only for methods with body
      const method = (config.method || "get").toLowerCase();
      const methodHasBody = ["post", "put", "patch"].includes(method);
      const hasData = config.data !== undefined && config.data !== null;
      if (
        methodHasBody &&
        hasData &&
        !config.headers["Content-Type"] &&
        !config.headers["content-type"]
      ) {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Basic response interceptor for auth errors and unified error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      // Optionally clear token or redirect to login here
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
