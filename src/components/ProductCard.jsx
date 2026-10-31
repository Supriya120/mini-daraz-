import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { formatPrice, discountedUsd } from "../utils/formatPrice.js";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const liked = isInWishlist(product.id);
  const discount = Math.round(product.discountPercentage || 0);

  const toggleWishlist = () => (liked ? removeFromWishlist(product.id) : addToWishlist(product));

  return (
    <article className="card product-card">
      <button className={`heart ${liked ? "active" : ""}`} onClick={toggleWishlist} aria-label="Toggle wishlist">
        {liked ? "♥" : "♡"}
      </button>
      <Link to={`/products/${product.id}`} className="product-img">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </Link>
      <div className="product-body">
        <small className="muted">{product.category}</small>
        <h3 className="product-title">{product.title}</h3>
        <div className="rating">⭐ {product.rating?.toFixed(1)}</div>
        <div className="price-row">
          <strong className="price">{formatPrice(discountedUsd(product.price, product.discountPercentage))}</strong>
          {discount > 0 && <span className="old-price">{formatPrice(product.price)}</span>}
        </div>
        <div className="meta-row">
          {discount > 0 && <span className="tag">{discount}% OFF</span>}
          <small className={product.stock > 0 ? "in-stock" : "out-stock"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </small>
        </div>
        <div className="card-actions">
          <Button disabled={product.stock === 0} onClick={() => addToCart(product)}>Add to Cart</Button>
          <Link to={`/products/${product.id}`} className="btn btn-outline">View Details</Link>
        </div>
      </div>
    </article>
  );
}
