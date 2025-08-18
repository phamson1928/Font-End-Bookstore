import React, { createContext, useContext, useReducer, useEffect } from "react";

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

  // Load cart from localStorage on mount
  useEffect(() => {
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
                item?.discount_price != null ? item.discount_price : item?.price,
            }))
          : [];
        dispatch({ type: "LOAD_CART", payload: migratedItems });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bookstore_cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (book, quantity = 1) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: book?.id ?? book?._id,
        title: book.title,
        author: book.author,
        price: book.price,
        discount_price:
          book?.discount_price != null ? book.discount_price : book.price,
        image: book.image,
        quantity: quantity,
      },
    });
  };

  const removeFromCart = (bookId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: bookId });
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id: bookId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const unit = item?.discount_price != null ? item.discount_price : item.price;
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
