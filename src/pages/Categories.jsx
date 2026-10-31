import useFetch from "../hooks/useFetch.js";
import { getCategories } from "../services/api.js";
import CategoryCard from "../components/CategoryCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function Categories() {
  const { data: categories, loading, error, retry } = useFetch(getCategories, []);
  if (loading) return <Loading text="Loading categories..." />;
  if (error) return <ErrorMessage onRetry={retry} />;
  return (
    <>
      <h1>All Categories</h1>
      <div className="category-grid">
        {categories.map((c) => <CategoryCard key={c.slug || c} category={c} />)}
      </div>
    </>
  );
}
