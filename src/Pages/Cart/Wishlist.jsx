import React, { useEffect, useState, useContext } from "react";
import { FaRupeeSign, FaTrashAlt } from "react-icons/fa";
import { CartContext } from "../../Context/CartContext";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // Get user data from AuthContext
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) {
        setWishlist([]); // If no user logged in, set wishlist to empty
        return;
      }
      try {
        const res = await axios.get(
          `https://kondaji-express-api.onrender.com/api/userdata/wishlist/${user.id}`
        );
        setWishlist(res.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    if (!user?.id) {
      console.log("Please log in to remove items from the wishlist.");
      return;
    }

    try {
      await axios.post(
        "https://kondaji-express-api.onrender.com/api/userdata/wishlist/remove",
        {
          userId: user.id,
          productId: productId,
        }
      );
      // Remove product from the wishlist state
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.id !== productId)
      );
    } catch (err) {
      console.error("Error removing product from wishlist:", err);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product); // Add to cart using CartContext
    handleRemove(product.id); // Optionally remove from wishlist after adding to cart
  };

  if (wishlist.length === 0) {
    return (
      <div className="py-20 text-center text-gray-600 text-xl">
        🛒 Your wishlist is empty.
        <br />
        <button
          onClick={() => navigate("/products")}
          className="mt-5 px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          My Wishlist ❤️
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((item, index) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.04 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 flex flex-col items-center text-center relative"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-contain mb-4"
              />
              <h2 className="font-semibold text-gray-900 mb-2">{item.name}</h2>
              <p className="text-green-600 font-bold flex items-center justify-center mb-3">
                <FaRupeeSign className="mr-1" />
                {parseFloat(item.price).toFixed(2)}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-red-600"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-gray-200 text-red-600 text-sm px-3 py-2 rounded hover:bg-red-100"
                  title="Remove from Wishlist"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
