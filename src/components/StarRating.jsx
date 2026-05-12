export default function StarRating({ rating, size = 'sm' }) {
  const fullStars  = Math.floor(rating);
  const halfStar   = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`star-rating star-${size}`}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star star-full">★</span>
      ))}
      {halfStar && <span className="star star-half">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star star-empty">★</span>
      ))}
      <span className="rating-num">{rating.toFixed(1)}</span>
    </div>
  );
}
