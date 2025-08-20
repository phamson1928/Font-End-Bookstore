import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api, getToken, onTokenChange } from "../api";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload || [],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  // Helper: map server cart response to UI items shape
  const mapServerCartToItems = (cart) => {
    const items = Array.isArray(cart?.items) ? cart.items : [];
    return items.map((ci) => {
      const b = ci?.book || {};
      return {
        // Keep UI key as book id to avoid refactoring consumers
        id: b?.id ?? b?._id ?? ci?.book_id,
        cartItemId: ci?.id, // needed for server-side update/delete
        title: b?.title,
        author: b?.author,
        price: b?.price,
        discount_price: b?.discount_price != null ? b.discount_price : b?.price,
        image: b?.image,
        quantity: ci?.quantity ?? 1,
      };
    });
  };

  // Load cart from server if authenticated; else from localStorage
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Authenticated flow: fetch from backend
      (async () => {
        try {
          const res = await api.get("/cart");
          const items = mapServerCartToItems(res?.data);
          dispatch({ type: "LOAD_CART", payload: items });
        } catch (err) {
          console.error("Failed to load cart from server:", err);
        }
      })();
    } else {
      // Guest flow: load from localStorage
      const savedCart = localStorage.getItem("bookstore_cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Migrate legacy items to ensure discount_price exists
          const migratedItems = Array.isArray(parsedCart)
            ? parsedCart.map((item) => ({
                // Ensure a stable id exists for all downstream operations
                id: item?.id ?? item?._id,
                ...item,
                discount_price:
                  item?.discount_price != null
                    ? item.discount_price
                    : item?.price,
              }))
            : [];
          dispatch({ type: "LOAD_CART", payload: migratedItems });
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bookstore_cart", JSON.stringify(state.items));
  }, [state.items]);

  // React to login/logout without a full page refresh
  useEffect(() => {
    const unsubscribe = onTokenChange(async (token) => {
      if (token) {
        // Logged in again -> fetch server cart
        await fetchCart();
      } else {
        // Logged out -> show guest cart from localStorage or clear
        const savedCart = localStorage.getItem("bookstore_cart");
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            const migratedItems = Array.isArray(parsedCart)
              ? parsedCart.map((item) => ({
                  id: item?.id ?? item?._id,
                  ...item,
                  discount_price:
                    item?.discount_price != null
                      ? item.discount_price
                      : item?.price,
                }))
              : [];
            dispatch({ type: "LOAD_CART", payload: migratedItems });
          } catch {
            dispatch({ type: "CLEAR_CART" });
          }
        } else {
          dispatch({ type: "CLEAR_CART" });
        }
      }
    });
    return unsubscribe;
  }, []);

  // Fetch latest cart from server and update state
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      const items = mapServerCartToItems(res?.data);
      dispatch({ type: "LOAD_CART", payload: items });
    } catch (err) {
      console.error("Failed to refresh cart from server:", err);
    }
  };

  const addToCart = async (book, quantity = 1) => {
    const token = getToken();
    const payload = {
      id: book?.id ?? book?._id,
      title: book.title,
      author: book.author,
      price: book.price,
      discount_price:
        book?.discount_price != null ? book.discount_price : book.price,
      image: book.image,
      quantity: quantity,
    };

    if (token) {
      try {
        await api.post("/cart", {
          book_id: payload.id,
          quantity: quantity,
        });
        await fetchCart();
      } catch (err) {
        console.error("Failed to add to server cart:", err);
      }
    } else {
      // Guest: local state only
      dispatch({ type: "ADD_TO_CART", payload });
    }
  };

  const removeFromCart = (bookId) => {
    const token = getToken();
    if (token) {
      const item = state.items.find((it) => it.id === bookId);
      const cartItemId = item?.cartItemId;
      if (!cartItemId) return;
      (async () => {
        try {
          await api.delete(`/cart/${cartItemId}`);
          await fetchCart();
        } catch (err) {
          console.error("Failed to remove item from server cart:", err);
        }
      })();
    } else {
      dispatch({ type: "REMOVE_FROM_CART", payload: bookId });
    }
  };

  const updateQuantity = (bookId, quantity) => {
    const token = getToken();
    if (quantity <= 0) return removeFromCart(bookId);

    if (token) {
      const item = state.items.find((it) => it.id === bookId);
      const cartItemId = item?.cartItemId;
      if (!cartItemId) return;
      (async () => {
        try {
          await api.put(`/cart/${cartItemId}`, { quantity });
          await fetchCart();
        } catch (err) {
          console.error("Failed to update quantity on server cart:", err);
        }
      })();
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id: bookId, quantity } });
    }
  };

  const clearCart = () => {
    const token = getToken();
    if (token) {
      (async () => {
        try {
          await api.delete("/cart");
          await fetchCart();
        } catch (err) {
          console.error("Failed to clear server cart:", err);
        }
      })();
    } else {
      dispatch({ type: "CLEAR_CART" });
    }
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const unit =
        item?.discount_price != null ? item.discount_price : item.price;
      return total + Number(unit || 0) * Number(item.quantity || 0);
    }, 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    // Expose for rare manual refresh needs
    // fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
