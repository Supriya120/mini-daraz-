import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage.js";
import { formatNpr } from "../utils/formatPrice.js";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";

const PAYMENT_METHODS = ["Cash on Delivery", "Credit/Debit Card", "eSewa", "Khalti"];

export default function Checkout() {
  const { cartItems, totals, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    fullName: currentUser.name || "", email: currentUser.email || "", phone: currentUser.phone || "",
    address: currentUser.address || "", city: "", province: "", postalCode: "",
  });
  const [payment, setPayment] = useState(PAYMENT_METHODS[0]);
  const [errors, setErrors] = useState({});
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a 10-digit phone number.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.province) e.province = "Select a province.";
    if (!/^\d{5}$/.test(form.postalCode)) e.postalCode = "Enter a 5-digit postal code.";
    return e;
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const order = {
      id: `MD-${Date.now().toString().slice(-8)}`, // dummy order ID
      date: new Date().toISOString(),
      userEmail: currentUser.email,
      items: cartItems.map(({ id, title, thumbnail, quantity }) => ({ id, title, thumbnail, quantity })),
      total: totals.total,
      status: "Processing",
      payment,
      customer: form,
    };
    saveToLocalStorage("orders", [order, ...getFromLocalStorage("orders", [])]);
    clearCart();
    setPlacedOrder(order);
  };

  // Must be checked before the empty-cart check, because the cart is cleared after ordering.
  if (placedOrder) {
    return (
      <div className="empty success">
        <div className="empty-icon">✅</div>
        <h2>Order placed successfully!</h2>
        <p>Your order ID is <strong>{placedOrder.id}</strong></p>
        <Link to="/orders" className="btn btn-primary">View My Orders</Link>
      </div>
    );
  }
  if (cartItems.length === 0) {
    return <EmptyState icon="🛒" title="Your cart is empty." message="Add products before checking out." actionText="Continue Shopping" />;
  }

  return (
    <>
      <h1>Checkout</h1>
      <form className="cart-layout" onSubmit={handlePlaceOrder} noValidate>
        <div className="card form-card">
          <h3>Customer Information</h3>
          <div className="form-grid">
            <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} />
            <Input label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} />
            <Input label="Province" name="province" as="select" value={form.province} onChange={handleChange} error={errors.province}>
              <option value="">Select province</option>
              {["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"].map((p) => <option key={p}>{p}</option>)}
            </Input>
            <Input label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} error={errors.postalCode} />
          </div>

          <h3>Payment Method</h3>
          <div className="payment-list">
            {PAYMENT_METHODS.map((method) => (
              <label key={method} className="payment-option">
                <input type="radio" name="payment" checked={payment === method} onChange={() => setPayment(method)} /> {method}
              </label>
            ))}
          </div>
          <small className="muted">Dummy payment options. No real payment is processed.</small>
        </div>

        <aside className="card summary">
          <h3>Order Summary</h3>
          {cartItems.map((i) => <div key={i.id} className="sum-row"><span>{i.title} × {i.quantity}</span></div>)}
          <div className="sum-row"><span>Subtotal</span><span>{formatNpr(totals.subtotal)}</span></div>
          <div className="sum-row"><span>Discount</span><span>− {formatNpr(totals.discount)}</span></div>
          <div className="sum-row"><span>Delivery</span><span>{formatNpr(totals.delivery)}</span></div>
          <div className="sum-row total"><span>Total</span><span>{formatNpr(totals.total)}</span></div>
          <Button type="submit" className="block">Place Order</Button>
        </aside>
      </form>
    </>
  );
}
