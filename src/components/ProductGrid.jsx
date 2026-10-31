import ProductCard from "./ProductCard.jsx";
import { ProductSkeleton } from "./Loading.jsx";

// Shows skeletons while loading, otherwise the real cards.
export default function ProductGrid({ products = [], loading = false, skeletonCount = 8 }) {
  if (loading) {
    return (
      <div className="grid">
        {Array.from({ length: skeletonCount }).map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    );
  }
  return (
    <div className="grid">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
