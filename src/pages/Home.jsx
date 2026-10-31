import { useMemo } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getProducts, getCategories } from "../services/api.js";
import ProductGrid from "../components/ProductGrid.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";

export default function Home() {
  const { data: productData, loading, error, retry } = useFetch(() => getProducts(100), []);
  const { data: categories, loading: catLoading } = useFetch(getCategories, []);
  const products = productData?.products || [];

  // useMemo: sort once, not on every render.
  const flashSale = useMemo(
    () => [...products].sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 8),
    [products]
  );
  const popular = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8), [products]);
  const recommended = useMemo(() => products.slice(20, 28), [products]);

  return (
    <>
      <section className="hero">
        <div>
          <h1>Big Savings. Fast Delivery.</h1>
          <p>Discover thousands of products at great prices, delivered across Nepal.</p>
          <Link to="/products" className="btn btn-light">Shop Now</Link>
        </div>
        <div className="hero-emoji" aria-hidden="true">🛍️</div>
      </section>

      <section>
        <div className="section-head"><h2>Shop by Category</h2><Link to="/categories">See all</Link></div>
        {catLoading ? <Loading text="Loading categories..." /> : (
          <div className="category-grid">
            {(categories || []).slice(0, 12).map((c) => <CategoryCard key={c.slug || c} category={c} />)}
          </div>
        )}
      </section>

      {error ? <ErrorMessage onRetry={retry} /> : (
        <>
          <section>
            <div className="section-head"><h2>⚡ Flash Sale</h2><Link to="/products">View all</Link></div>
            <ProductGrid products={flashSale} loading={loading} />
          </section>
          <section>
            <div className="section-head"><h2>Popular Products</h2></div>
            <ProductGrid products={popular} loading={loading} />
          </section>
          <section>
            <div className="section-head"><h2>Recommended for You</h2></div>
            <ProductGrid products={recommended} loading={loading} />
          </section>
        </>
      )}
    </>
  );
}
