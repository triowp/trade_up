import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">
          🌿✓ <span>FreshMarket</span>
        </NavLink>

        <nav className={`navbar__links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Главная</NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Магазин</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>О нас</NavLink>
          {user ? (
            <NavLink to="/profile" onClick={() => setMenuOpen(false)}>Профиль</NavLink>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>Вход</NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)}>Регистрация</NavLink>
            </>
          )}
        </nav>

        <div className="navbar__actions">
          <button
            className="navbar__cart"
            onClick={() => navigate("/cart")}
            aria-label="Корзина"
          >
            🛒
            {totalItems > 0 && (
              <span className="navbar__badge">{totalItems}</span>
            )}
          </button>
          {user && (
            <button
              className="navbar__logout"
              onClick={handleLogout}
              aria-label="Выйти"
            >
              🚪
            </button>
          )}
          <button
            className="navbar__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
