import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, discountedUsd } from "../utils/formatPrice.js";
import EmptyState from "../components/EmptyState.jsx";
import Button from "../components/Button.jsx";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return <EmptyState icon="💛" title="Your wishlist is empty." message="Save products you love!" actionText="Browse Products" />;
  }

  const moveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  return (
    <>
      <h1>My Wishlist ({wishlistItems.length})</h1>
      <div className="grid">
        {wishlistItems.map((item) => (
          <article key={item.id} className="card product-card">
            <Link to={`/products/${item.id}`} className="product-img"><img src={item.thumbnail} alt={item.title} /></Link>
            <div className="product-body">
              <h3 className="product-title">{item.title}</h3>
              <strong className="price">{formatPrice(discountedUsd(item.price, item.discountPercentage))}</strong>
              <div className="card-actions">
                <Button onClick={() => moveToCart(item)}>Move to Cart</Button>
                <Button variant="outline" onClick={() => removeFromWishlist(item.id)}>Remove</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
