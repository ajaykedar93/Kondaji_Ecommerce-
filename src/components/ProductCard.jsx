import React from 'react';

const ProductCard = ({ product, onBuyNow, onAddToCart }) => {
  const {
    name,
    image,
    price,
    discount = 0,
    description,
  } = product;

  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <div className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-all duration-300">
      <img
        src={image}
        alt={name}
        className="w-full h-56 object-cover"
      />
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>

        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-xl font-bold text-green-600">
              ₹{finalPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="ml-2 text-sm line-through text-gray-500">
                ₹{price.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            {discount > 0 ? `${discount}% OFF` : 'No Offer'}
          </span>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onBuyNow(product)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg font-semibold"
          >
            Buy Now
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm py-2 rounded-lg font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
