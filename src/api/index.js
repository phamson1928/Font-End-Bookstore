export { default as api } from "./client";

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

// Internal: notify listeners that token changed
const dispatchTokenChanged = (token) => {
  try {
    window.dispatchEvent(
      new CustomEvent("auth:token-changed", { detail: { token } })
    );
  } catch {
    // no-op in non-browser environments
  }
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  dispatchTokenChanged(token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  dispatchTokenChanged(null);
};

// Subscribe to token change events. Returns an unsubscribe function.
export const onTokenChange = (handler) => {
  const listener = (e) => handler(e?.detail?.token ?? null);
  window.addEventListener("auth:token-changed", listener);
  return () => window.removeEventListener("auth:token-changed", listener);
};
