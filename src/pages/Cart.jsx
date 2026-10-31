import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatNpr } from "../utils/formatPrice.js";
import CartItem from "../components/CartItem.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Button from "../components/Button.jsx";

export default function Cart() {
  const { cartItems, totals, clearCart } = useCart();

  if (cartItems.length === 0) {
    return <EmptyState icon="🛒" title="Your cart is empty." message="Start shopping and add some products!" actionText="Continue Shopping" />;
  }

  return (
    <>
      <div className="section-head"><h1>Shopping Cart</h1><Button variant="ghost" onClick={clearCart}>Clear cart</Button></div>
      <div className="cart-layout">
        <div className="cart-list">
          {cartItems.map((item) => <CartItem key={item.id} item={item} />)}
        </div>
        <aside className="card summary">
          <h3>Order Summary</h3>
          <div className="sum-row"><span>Subtotal</span><span>{formatNpr(totals.subtotal)}</span></div>
          <div className="sum-row"><span>Discount</span><span>− {formatNpr(totals.discount)}</span></div>
          <div className="sum-row"><span>Delivery</span><span>{formatNpr(totals.delivery)}</span></div>
          <div className="sum-row total"><span>Total</span><span>{formatNpr(totals.total)}</span></div>
          <Link to="/checkout" className="btn btn-primary block">Proceed to Checkout</Link>
        </aside>
      </div>
    </>
  );
}
