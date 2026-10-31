import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage.js";
import OrderCard from "../components/OrderCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Button from "../components/Button.jsx";

const sampleItem = (id, title, thumbnail) => ({ id, title, thumbnail, quantity: 1 });
const THUMB = "https://cdn.dummyjson.com/product-images";

export default function Orders() {
  const { currentUser } = useAuth();
  const [allOrders, setAllOrders] = useState(() => getFromLocalStorage("orders", []));
  const myOrders = allOrders.filter((o) => o.userEmail === currentUser.email);

  // Lets you see every status without waiting: adds 3 sample orders.
  const addSampleOrders = () => {
    const make = (n, status, total, items) => ({
      id: `MD-SAMPLE${n}`, date: new Date(Date.now() - n * 86400000 * 3).toISOString(),
      userEmail: currentUser.email, items, total, status, payment: "Cash on Delivery",
    });
    const updated = [
      ...allOrders,
      make(1, "Shipped", 4600, [sampleItem(1, "Essence Mascara Lash Princess", `${THUMB}/beauty/essence-mascara-lash-princess/thumbnail.webp`)]),
      make(2, "Delivered", 12500, [sampleItem(2, "Eyeshadow Palette with Mirror", `${THUMB}/beauty/eyeshadow-palette-with-mirror/thumbnail.webp`)]),
      make(3, "Cancelled", 900, [sampleItem(3, "Powder Canister", `${THUMB}/beauty/powder-canister/thumbnail.webp`)]),
    ];
    saveToLocalStorage("orders", updated);
    setAllOrders(updated);
  };

  if (myOrders.length === 0) {
    return (
      <>
        <EmptyState icon="📦" title="No orders yet" message="Place an order and it will appear here." actionText="Start Shopping" />
        <div className="center"><Button variant="outline" onClick={addSampleOrders}>Load sample orders</Button></div>
      </>
    );
  }

  return (
    <>
      <h1>My Orders</h1>
      <div className="stack">{myOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div>
    </>
  );
}
