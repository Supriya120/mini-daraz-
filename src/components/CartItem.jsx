import { useCart } from "../context/CartContext.jsx";
import { formatPrice, discountedUsd } from "../utils/formatPrice.js";

export default function CartItem({ item }) {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const unitPrice = discountedUsd(item.price, item.discountPercentage);

  return (
    <div className="cart-item card">
      <img src={item.thumbnail} alt={item.title} />
      <div className="cart-info">
        <h4>{item.title}</h4>
        <p className="price">{formatPrice(unitPrice)}</p>
        <div className="qty">
          <button onClick={() => decreaseQuantity(item.id)} aria-label="Decrease">−</button>
          <span>{item.quantity}</span>
          <button onClick={() => increaseQuantity(item.id)} aria-label="Increase">+</button>
        </div>
      </div>
      <div className="cart-side">
        <strong>{formatPrice(unitPrice * item.quantity)}</strong>
        <button className="link-btn danger-text" onClick={() => removeFromCart(item.id)}>Remove</button>
      </div>
    </div>
  );
}
