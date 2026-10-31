import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the page from reloading
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/products?q=${encodeURIComponent(trimmed)}`);
    onSearch?.();
  };

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." aria-label="Search products" />
      <button type="submit">Search</button>
    </form>
  );
}
