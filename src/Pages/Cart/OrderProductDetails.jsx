import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_PRODUCTS = 'https://kondaji-express-api.onrender.com/api/products';
const API_BASE_URL = 'https://kondaji-express-api.onrender.com';

const OrderProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_PRODUCTS}/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const getFullImageUrl = (img) => {
    if (!img) return '/default-product.png';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return API_BASE_URL + img;
    return API_BASE_URL + '/' + img;
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return '₹0.00';
    return '₹' + num.toFixed(2);
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centered}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
      </div>
    );
  }

  if (!product) return null;

  // Normalize images array
  const images = product.images
    ? Array.isArray(product.images)
      ? product.images
      : [product.images]
    : product.image
    ? [product.image]
    : ['/default-product.png'];

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back to Orders
      </button>

      <div style={styles.content}>
        {/* Left thumbnails */}
        <div style={styles.left}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={getFullImageUrl(img)}
              alt={`${product.name} image ${idx + 1}`}
              style={{
                ...styles.thumbnail,
                border:
                  idx === selectedImageIdx ? '3px solid #2f7d32' : '3px solid transparent',
                opacity: idx === selectedImageIdx ? 1 : 0.7,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedImageIdx(idx)}
            />
          ))}
        </div>

        {/* Main large image */}
        <div style={styles.middle}>
          <img
            src={getFullImageUrl(images[selectedImageIdx])}
            alt={product.name}
            style={styles.mainImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-product.png';
            }}
          />
        </div>

        {/* Right details */}
        <div style={styles.right}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.description}>{product.description || 'No description available.'}</p>

          <p style={styles.price}>
            Price: <strong>{formatPrice(product.price)}</strong>
          </p>

          {product.discount > 0 && (
            <p style={styles.discount}>
              Discount: -{formatPrice(product.discount)}
            </p>
          )}

          {product.offer && (
            <p style={styles.offer}>
              Offer: <strong>{product.offer}</strong>
            </p>
          )}

          <p style={styles.stock}>
            Status:{' '}
            <span style={{ color: product.in_stock ? '#5cb85c' : '#d9534f', fontWeight: 'bold' }}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </p>

          <p style={styles.deliveryCharge}>
            Delivery:{' '}
            {product.delivery_charge && product.delivery_charge > 0
              ? `Paid (₹${product.delivery_charge.toFixed(2)})`
              : 'Free'}
          </p>

          <button
            style={styles.buyMoreButton}
            onClick={() => navigate(`/product-details/${product.id}`)}
          >
            Buy More
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 1100,
    margin: '40px auto',
    padding: '0 24px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  backButton: {
    marginBottom: 24,
    backgroundColor: '#2f7d32',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: 16,
  },
  content: {
    display: 'flex',
    gap: 32,
    flexWrap: 'wrap',
  },
  left: {
    flex: '0 0 120px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxHeight: 600,
    overflowY: 'auto',
  },
  thumbnail: {
    width: '100%',
    borderRadius: 8,
    objectFit: 'cover',
    height: 100,
  },
  middle: {
    flex: '0 0 460px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    maxWidth: '100%',
    maxHeight: 600,
    objectFit: 'contain',
    borderRadius: 12,
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  },
  right: {
    flex: 1,
    minWidth: 280,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2f7d32',
  },
  description: {
    fontSize: 16,
    lineHeight: 1.5,
    marginBottom: 20,
    color: '#444',
  },
  price: {
    fontSize: 20,
    marginBottom: 8,
  },
  discount: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: '700',
    marginBottom: 8,
  },
  offer: {
    fontSize: 16,
    color: '#d35400',
    marginBottom: 8,
  },
  stock: {
    fontSize: 18,
    marginBottom: 8,
  },
  deliveryCharge: {
    fontSize: 16,
    marginBottom: 20,
  },
  buyMoreButton: {
    marginTop: 'auto',
    backgroundColor: '#2f7d32',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: 8,
    fontWeight: '700',
    fontSize: 18,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  centered: {
    height: '70vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: '#666',
  },
};

export default OrderProductDetails;
