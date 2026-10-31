export default function Loading({ text = "Loading..." }) {
  return (
    <div className="loading" role="status">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

// Grey placeholder card shown while products load.
export function ProductSkeleton() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </div>
  );
}
