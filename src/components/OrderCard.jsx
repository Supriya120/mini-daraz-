import { formatNpr } from "../utils/formatPrice.js";

export default function OrderCard({ order }) {
  return (
    <div className="card order-card">
      <div className="order-head">
        <div>
          <strong>{order.id}</strong>
          <small className="muted"> · {new Date(order.date).toLocaleDateString()}</small>
        </div>
        <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
      </div>
      <ul className="order-items">
        {order.items.map((item) => (
          <li key={item.id}>
            <img src={item.thumbnail} alt="" />
            <span>{item.title}</span>
            <small>× {item.quantity}</small>
          </li>
        ))}
      </ul>
      <div className="order-total">Total: <strong>{formatNpr(order.total)}</strong></div>
    </div>
  );
}
