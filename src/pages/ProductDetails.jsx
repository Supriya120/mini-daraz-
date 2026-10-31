import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getProductById, getProductsByCategory } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { formatPrice, discountedUsd } from "../utils/formatPrice.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Button from "../components/Button.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

function RelatedProducts({ category, currentId }) {
  const { data, loading } = useFetch(() => getProductsByCategory(category), [category]);
  const related = (data?.products || []).filter((p) => p.id !== currentId).slice(0, 4);
  if (!loading && related.length === 0) return null;
  return (
    <section>
      <h2>Related Products</h2>
      <ProductGrid products={related} loading={loading} skeletonCount={4} />
    </section>
  );
}

export default function ProductDetails() {
  const { id } = useParams(); // the :id part of the URL
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, loading, error, retry } = useFetch(() => getProductById(id), [id]);

  if (loading) return <Loading text="Loading product..." />;
  if (error?.status === 404) {
    return <EmptyState icon="😕" title="Product not found" message="This product does not exist." actionText="Back to products" />;
  }
  if (error) return <ErrorMessage onRetry={retry} />;

  const liked = isInWishlist(product.id);
  const discount = Math.round(product.discountPercentage || 0);
  const images = product.images?.length ? product.images : [product.thumbnail];
  const dims = product.dimensions;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  return (
    <>
      <p className="muted"><Link to="/products">Products</Link> / {product.category}</p>
      <div className="details">
        <div>
          <div className="detail-main-img"><img src={images[selectedImage]} alt={product.title} /></div>
          <div className="thumbs">
            {images.map((src, i) => (
              <img key={src} src={src} alt="" className={i === selectedImage ? "active" : ""} onClick={() => setSelectedImage(i)} />
            ))}
          </div>
        </div>

        <div className="detail-info">
          <h1>{product.title}</h1>
          <p className="muted">Brand: {product.brand || "No brand"} · Category: {product.category}</p>
          <div className="rating">⭐ {product.rating?.toFixed(1)}</div>
          <div className="price-row big">
            <strong className="price">{formatPrice(discountedUsd(product.price, product.discountPercentage))}</strong>
            {discount > 0 && <><span className="old-price">{formatPrice(product.price)}</span><span className="tag">{discount}% OFF</span></>}
          </div>
          <p>{product.description}</p>
          <p className={product.stock > 0 ? "in-stock" : "out-stock"}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </p>

          <div className="qty big-qty">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}>+</button>
          </div>

          <div className="detail-actions">
            <Button disabled={product.stock === 0} onClick={() => addToCart(product, quantity)}>Add to Cart</Button>
            <Button variant="dark" disabled={product.stock === 0} onClick={handleBuyNow}>Buy Now</Button>
            <Button variant="outline" onClick={() => (liked ? removeFromWishlist(product.id) : addToWishlist(product))}>
              {liked ? "♥ In Wishlist" : "♡ Add to Wishlist"}
            </Button>
          </div>
        </div>
      </div>

      <section className="card info-card">
        <h2>Product Information</h2>
        <table className="info-table">
          <tbody>
            <tr><th>Brand</th><td>{product.brand || "—"}</td></tr>
            <tr><th>SKU</th><td>{product.sku}</td></tr>
            <tr><th>Weight</th><td>{product.weight} g</td></tr>
            <tr><th>Dimensions</th><td>{dims ? `${dims.width} × ${dims.height} × ${dims.depth} cm` : "—"}</td></tr>
            <tr><th>Warranty</th><td>{product.warrantyInformation}</td></tr>
            <tr><th>Shipping</th><td>{product.shippingInformation}</td></tr>
            <tr><th>Return policy</th><td>{product.returnPolicy}</td></tr>
          </tbody>
        </table>
      </section>

      <RelatedProducts category={product.category} currentId={product.id} />
    </>
  );
}
