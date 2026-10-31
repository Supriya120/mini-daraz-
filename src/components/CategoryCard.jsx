import { Link } from "react-router-dom";

// The API may return plain strings or {slug, name} objects, so we handle both.
export default function CategoryCard({ category }) {
  const slug = typeof category === "string" ? category : category.slug;
  const name = typeof category === "string" ? category.replace(/-/g, " ") : category.name;
  return (
    <Link to={`/products?category=${slug}`} className="card category-card">
      <span className="category-name">{name}</span>
    </Link>
  );
}
