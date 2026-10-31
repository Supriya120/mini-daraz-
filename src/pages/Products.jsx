import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getProducts, getProductsByCategory, searchProducts, getCategories } from "../services/api.js";
import ProductGrid from "../components/ProductGrid.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Button from "../components/Button.jsx";

const PAGE_SIZE = 12;

export default function Products() {
  // The URL holds the search text and category, e.g. /products?q=phone&category=beauty
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data: categories } = useFetch(getCategories, []);

  // Choose which endpoint to call. Re-runs when query or category changes.
  const { data, loading, error, retry } = useFetch(() => {
    if (query) return searchProducts(query);
    if (category) return getProductsByCategory(category);
    return getProducts(0);
  }, [query, category]);

  const sortedProducts = useMemo(() => {
    let list = data?.products || [];
    if (query && category) list = list.filter((p) => p.category === category); // both filters
    
    const sorted = [...list]; // copy so we never mutate state
    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sortBy === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [data, query, category, sortBy]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
    setVisibleCount(PAGE_SIZE); // go back to page 1 of results
  };

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  return (
    <>
      <h1>{query ? `Search results for "${query}"` : category ? category.replace(/-/g, " ") : "All Products"}</h1>

      <div className="filters">
        <select value={category} onChange={(e) => updateParam("category", e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {(categories || []).map((c) => (
            <option key={c.slug || c} value={c.slug || c}>{c.name || c}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort">
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating: Highest First</option>
          <option value="name">Name: A-Z</option>
        </select>
        {(query || category) && <Button variant="ghost" onClick={() => setSearchParams({})}>Clear filters</Button>}
      </div>

      {error ? <ErrorMessage onRetry={retry} /> : !loading && sortedProducts.length === 0 ? (
        <EmptyState icon="🔍" title="No products found" message="Try a different search or category." actionText="View all products" />
      ) : (
        <>
          <ProductGrid products={visibleProducts} loading={loading} />
          {!loading && visibleCount < sortedProducts.length && (
            <div className="center">
              <Button variant="outline" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
                Load More ({sortedProducts.length - visibleCount} left)
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
