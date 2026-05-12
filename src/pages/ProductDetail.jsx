import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getProduct } from '../api';
import { useCart } from '../hooks/useCart';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const stockStatus = product.stock === 0
    ? 'Out of Stock'
    : product.stock <= 5
    ? `Only ${product.stock} left in stock!`
    : 'In Stock';

  const stockClass = product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'in';

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-grid">
        {/* Image */}
        <div className="detail-image-wrap">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/500x400?text=No+Image'}
            alt={product.name}
            className="detail-image"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400?text=No+Image'; }}
          />
        </div>

        {/* Info */}
        <div className="detail-info">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <StarRating rating={product.rating} size="md" />
            <span className="rating-count-lg">{product.numReviews} ratings</span>
          </div>

          <div className="detail-price">${product.price.toFixed(2)}</div>

          <div className={`stock-status stock-${stockClass}`}>
            {stockClass === 'in' ? '✅' : stockClass === 'low' ? '⚠️' : '❌'} {stockStatus}
          </div>

          <p className="detail-description">{product.description}</p>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>Qty:</label>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-display">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          )}

          <div className="detail-actions">
            <button
              className={`btn-add-cart ${added ? 'btn-added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
