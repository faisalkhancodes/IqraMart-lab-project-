import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getProducts } from '../api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (categoryQuery) params.category = categoryQuery;
        const { data } = await getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchQuery, categoryQuery]);

  return (
    <div className="home-page">
      {!searchQuery && !categoryQuery && (
        <>
          {/* Hero Banner */}
          <div className="home-hero"></div>

          {/* Overlapping Category Cards */}
          <div className="home-cards-container">
            {/* Card 1: 4 grid items */}
            <div className="category-card">
              <h2>Gaming accessories</h2>
              <div className="card-image-grid">
                <Link to="/?search=Headphones" className="grid-item">
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" alt="Headsets" />
                  <span>Headsets</span>
                </Link>
                <Link to="/?search=Keyboard" className="grid-item">
                  <img src="https://images.unsplash.com/photo-1595225476474-87563907a212?w=200" alt="Keyboards" />
                  <span>Keyboards</span>
                </Link>
                <Link to="/?search=Mouse" className="grid-item">
                  <img src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200" alt="Computer mice" />
                  <span>Computer mice</span>
                </Link>
                <Link to="/?search=Chair" className="grid-item">
                  <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200" alt="Chairs" />
                  <span>Chairs</span>
                </Link>
              </div>
              <Link to="/?search=Gaming" className="shop-now-link">See more</Link>
            </div>

            {/* Card 2: Single Image */}
            <div className="category-card">
              <h2>Shop Home & Kitchen</h2>
              <Link to="/?category=Kitchen" className="single-image">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400" alt="Kitchen" />
              </Link>
              <Link to="/?category=Kitchen" className="shop-now-link">Shop now</Link>
            </div>

            {/* Card 3: Single Image */}
            <div className="category-card">
              <h2>Refresh your space</h2>
              <Link to="/?category=Home" className="single-image">
                <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400" alt="Home Decor" />
              </Link>
              <Link to="/?category=Home" className="shop-now-link">See more</Link>
            </div>

            {/* Card 4: 4 grid items */}
            <div className="category-card">
              <h2>Top categories</h2>
              <div className="card-image-grid">
                <Link to="/?category=Electronics" className="grid-item">
                  <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200" alt="Electronics" />
                  <span>Electronics</span>
                </Link>
                <Link to="/?category=Clothing" className="grid-item">
                  <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=200" alt="Fashion" />
                  <span>Fashion</span>
                </Link>
                <Link to="/?category=Toys" className="grid-item">
                  <img src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200" alt="Toys" />
                  <span>Toys</span>
                </Link>
                <Link to="/?category=Books" className="grid-item">
                  <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200" alt="Books" />
                  <span>Books</span>
                </Link>
              </div>
              <Link to="/" className="shop-now-link">Shop all</Link>
            </div>
          </div>
        </>
      )}

      {/* Search Results / Product Grid */}
      <div className="product-strip">
        <h2>
          {searchQuery ? `Results for "${searchQuery}"` : 
           categoryQuery ? `Category: ${categoryQuery}` : 
           "Discover more items"}
        </h2>
        
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try a different search term.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
