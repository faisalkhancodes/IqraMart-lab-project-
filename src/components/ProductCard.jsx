import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Split price to show small dollar sign
  const priceParts = product.price.toString().split('.');
  const whole = priceParts[0];
  const fraction = priceParts[1] || '00';

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-img-wrap">
        <img src={product.imageUrl} alt={product.name} className="product-img" />
      </Link>
      
      <div className="product-info">
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="star-rating">
          <StarRating rating={product.rating} />
          <span className="rating-num">{product.numReviews}</span>
        </div>
        
        <div className="product-price">
          <span className="price-symbol">$</span>
          <span>{whole}</span>
          <span className="price-symbol" style={{fontSize: '0.75rem', marginTop: '2px'}}>{fraction}</span>
        </div>
        
        <span className="delivery-info">
          Ships to Pakistan
        </span>
        
        <button 
          className="btn-yellow"
          onClick={() => addToCart(product, 1)}
          disabled={product.stock === 0}
          style={{marginTop: 'auto'}}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
