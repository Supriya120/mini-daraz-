import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={closeMenu}>Mini<span>Daraz</span></Link>
        <button className="icon-btn menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <SearchBar onSearch={closeMenu} />
          <nav>
            <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
            <NavLink to="/categories" onClick={closeMenu}>Categories</NavLink>
            <NavLink to="/products" onClick={closeMenu}>Products</NavLink>
          </nav>
          <div className="nav-actions">
            <Link to="/wishlist" onClick={closeMenu} className="nav-icon" aria-label="Wishlist">
              ♡ {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
            </Link>
            <Link to="/cart" onClick={closeMenu} className="nav-icon" aria-label="Cart">
              🛒 {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={closeMenu} className="nav-user">👤 {currentUser.name.split(" ")[0]}</Link>
                <button className="link-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>Login</Link>
                <Link to="/register" onClick={closeMenu} className="btn btn-primary small">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
