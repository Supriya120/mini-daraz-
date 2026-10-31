import { Link } from "react-router-dom";

export default function EmptyState({ icon = "🛍️", title, message, actionText, actionTo = "/products" }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionText && <Link to={actionTo} className="btn btn-primary">{actionText}</Link>}
    </div>
  );
}
