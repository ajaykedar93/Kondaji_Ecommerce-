import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';


export const CartContext = createContext();


const safeParse = (data, fallback) => {
  try {
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => safeParse(localStorage.getItem('cart'), []));
  const [wishlist, setWishlist] = useState(() => safeParse(localStorage.getItem('wishlist'), []));
  const [address, setAddress] = useState(() =>
    safeParse(localStorage.getItem('address'), {
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
    })
  );
  const [products, setProducts] = useState([]);

  
  const API_BASE_URL = 'https://kondaji-express-api.onrender.com';

  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('address', JSON.stringify(address));
  }, [address]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch user's cart from DB
  const fetchCartFromDB = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/userdata/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart from DB:', err);
    }
  };

  // Add item to cart
  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.max(item.quantity + 1, 1) } : item
        )
      );
    } else {
      const newItem = {
        ...product,
        quantity: 1,
        originalPrice: product.originalPrice || product.price,
      };
      setCart([...cart, newItem]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (typeof newQuantity !== 'number' || newQuantity < 1) return;
    setCart(
      cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Toggle wishlist
  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => String(item.id) === String(product.id));
    if (exists) {
      setWishlist(wishlist.filter((item) => String(item.id) !== String(product.id)));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const isWishlisted = (productId) => wishlist.some((item) => String(item.id) === String(productId));

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter((item) => String(item.id) !== String(productId)));
  };

  const updateAddress = (newAddress) => {
    setAddress((prev) => ({ ...prev, ...newAddress }));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  const clearAddress = () => {
    const empty = {
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
    };
    setAddress(empty);
    localStorage.removeItem('address');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        fetchCartFromDB,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
        address,
        updateAddress,
        clearAddress,
        products,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
