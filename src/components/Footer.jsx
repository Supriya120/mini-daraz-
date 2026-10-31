import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>Mini Daraz</strong>
          <p>A practice e-commerce project built with React.</p>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/products">Shop</Link>
        </div>
        <small>© {new Date().getFullYear()} Mini Daraz. Demo only.</small>
      </div>
    </footer>
  );
}
