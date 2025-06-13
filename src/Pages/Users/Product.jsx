import React, { useEffect, useState, useContext } from "react";
import { FaRupeeSign, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";
import { AuthContext } from "../../Context/AuthContext";

const Product = () => {
  const { addToCart, isWishlisted, toggleWishlist } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState(0);
  const [sortOption, setSortOption] = useState("none");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://kondaji-express-api.onrender.com/api/products");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("\u274C Failed to fetch products. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`https://kondaji-express-api.onrender.com/api/userdata/wishlist/${user.id}`);
        if (!res.ok) throw new Error("Failed to load wishlist");
        const data = await res.json();
        const wishlistedIds = data.map((item) => item.id);
        setWishlistData(wishlistedIds);
      } catch (err) {
        setError("\u274C Failed to fetch wishlist.");
      }
    };

    fetchProducts();
    if (user?.id) fetchWishlist();
  }, [user]);

  const handleAddToCart = async (product) => {
    if (!user?.id) return setError("\u274C Please log in to add items to the cart.");
    try {
      await axios.post("https://kondaji-express-api.onrender.com/api/userdata/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity: 1,
        price: product.price,
      });
      addToCart(product);
      setMessage("\u2705 Product added to cart successfully!");
      setTimeout(() => setMessage(""), 1800);
    } catch (err) {
      setError("\u274C Failed to add product to cart. Try again later.");
    }
  };

  const handleWishlistClick = async (product) => {
    if (!user?.id) return setError("\u274C Please log in to add to wishlist.");

    const isInWishlist = wishlistData.includes(product.id);
    setWishlistData((prev) =>
      isInWishlist ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
    toggleWishlist(product);

    try {
      const url = isInWishlist ? "wishlist/remove" : "wishlist/add";
      await axios.post(`https://kondaji-express-api.onrender.com/api/userdata/${url}`, {
        userId: user.id,
        productId: product.id,
      });
    } catch (err) {
      setError("\u274C Failed to update wishlist.");
    }
  };

  const handleImageClick = (id) => navigate(`/product-details/${id}`);

  let filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    const matchesPrice = filterPrice === 0 || p.price <= filterPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (sortOption === "lowToHigh") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-white to-gray-100">
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 text-green-800 px-6 py-3 rounded-lg shadow-xl text-center text-lg font-semibold z-50"
        >
          {message}
        </motion.div>
      )}

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/4"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/4"
          >
            <option value="all">All Categories</option>
            <option value="snacks">Snacks</option>
            <option value="drinks">Drinks</option>
            <option value="spices">Spices</option>
          </select>

          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={filterPrice}
            onChange={(e) => setFilterPrice(Number(e.target.value))}
            className="w-full md:w-1/4"
          />
          <span className="text-sm text-gray-600">Max Price: ₹{filterPrice}</span>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/4"
          >
            <option value="none">Sort By</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => {
            const wishlisted = wishlistData.includes(product.id);
            return (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border-[2.5px] border-black rounded-2xl p-6 shadow-lg flex flex-col justify-between items-center gap-4 relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => handleWishlistClick(product)}
                    className={`text-xl hover:scale-110 transition-transform ${
                      wishlisted ? "text-red-600" : "text-gray-400"
                    }`}
                  >
                    {wishlisted ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>

                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => handleImageClick(product.id)}
                  className="w-28 h-28 object-contain cursor-pointer hover:scale-110 transition-transform"
                />

                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-900 capitalize leading-5 mb-1">
                    {product.name}
                  </h2>
                  <p className="text-green-600 font-bold text-base flex items-center justify-center">
                    <FaRupeeSign className="mr-1 text-green-500" />
                    {parseFloat(product.price).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-black text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-red-600 transition duration-300 mt-2"
                >
                  Add to Cart
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Product;
