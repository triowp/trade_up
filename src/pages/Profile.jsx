import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import "./Profile.css";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { items, totalPrice } = useCart();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });
  const navigate = useNavigate();

  // Mock order history
  const orderHistory = [
    { id: 1, date: "2024-01-15", total: 45.99, status: "Доставлено" },
    { id: 2, date: "2024-01-10", total: 32.50, status: "Доставлено" },
    { id: 3, date: "2024-01-05", total: 78.25, status: "В обработке" }
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile(formData);
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile">
      <div className="profile__container">
        <div className="profile__header">
          <div className="profile__avatar">
            <div className="avatar-circle">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
          <div className="profile__title">
            <h1>Мой профиль</h1>
            <p>Добро пожаловать, {user.name}!</p>
          </div>
        </div>

        <div className="profile__content">
          <div className="profile__section">
            <h2>Личная информация</h2>
            {editing ? (
              <div className="profile__edit">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Имя</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Введите ваше имя"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Введите ваш email"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Телефон</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Введите ваш телефон"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Адрес доставки</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Введите ваш адрес доставки"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="profile__actions">
                  <button onClick={handleSave} className="btn btn--primary">Сохранить</button>
                  <button onClick={() => setEditing(false)} className="btn btn--secondary">Отмена</button>
                </div>
              </div>
            ) : (
              <div className="profile__view">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Имя:</span>
                    <span className="info-value">{user.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Телефон:</span>
                    <span className="info-value">{user.phone || "Не указан"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Адрес:</span>
                    <span className="info-value">{user.address || "Не указан"}</span>
                  </div>
                </div>
                <button onClick={() => setEditing(true)} className="btn btn--primary">Редактировать профиль</button>
              </div>
            )}
          </div>

          <div className="profile__section">
            <h2>История заказов</h2>
            <div className="orders-list">
              {orderHistory.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-id">Заказ #{order.id}</span>
                    <span className="order-date">{order.date}</span>
                  </div>
                  <div className="order-details">
                    <span className="order-total">{order.total} ₽</span>
                    <span className={`order-status status--${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="profile__section">
            <h2>Корзина</h2>
            {items.length > 0 ? (
              <div className="cart-summary">
                <p>Товаров в корзине: {items.length}</p>
                <p>Общая сумма: {totalPrice.toFixed(2)} ₽</p>
                <button onClick={() => navigate("/cart")} className="btn btn--primary">
                  Перейти в корзину
                </button>
              </div>
            ) : (
              <p className="empty-cart">Ваша корзина пуста</p>
            )}
          </div>
        </div>

        <div className="profile__footer">
          <button onClick={handleLogout} className="btn btn--danger">Выйти из аккаунта</button>
        </div>
      </div>
    </div>
  );
}