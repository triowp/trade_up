import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { createOrder } from "../api/orders";
import "./Checkout.css";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    paymentMethod: "card",
    deliveryMethod: "courier"
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && items.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [user, items.length, orderPlaced, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderError("");

    const orderPayload = {
      userId: user?.id,
      items,
      total: totalPrice,
      status: "pending",
      paymentMethod: formData.paymentMethod,
      deliveryMethod: formData.deliveryMethod,
      address: formData.address,
      city: "",
      phone: formData.phone,
    };

    try {
      const order = await createOrder(orderPayload);
      setOrderNumber(order.id || Date.now().toString());
      setOrderPlaced(true);
      clearCart();
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (err) {
      console.error(err);
      setOrderError("Не удалось отправить заказ. Попробуйте позже.");
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout">
        <div className="checkout__container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h1>Заказ оформлен!</h1>
            <p>Спасибо за покупку. Ваш заказ успешно принят.</p>
            <p>Мы свяжемся с вами в ближайшее время для подтверждения деталей.</p>
            <div className="order-details">
              <p><strong>Номер заказа:</strong> #{orderNumber}</p>
              <p><strong>Общая сумма:</strong> {totalPrice.toFixed(2)} ₽</p>
            </div>
            <p className="redirect-message">Перенаправление в профиль через 3 секунды...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__container">
        <h1>Оформление заказа</h1>

        <div className="checkout__content">
          <div className="checkout__left">
            <div className="checkout__section">
              <h2>Контактная информация</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Имя *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Телефон *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="deliveryMethod">Способ доставки</label>
                    <select
                      id="deliveryMethod"
                      name="deliveryMethod"
                      value={formData.deliveryMethod}
                      onChange={handleChange}
                    >
                      <option value="courier">Курьер</option>
                      <option value="pickup">Самовывоз</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Адрес доставки *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    required
                    placeholder="Укажите полный адрес доставки"
                  />
                </div>

                <div className="checkout__section">
                  <h2>Способ оплаты</h2>
                  <div className="payment-methods">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleChange}
                      />
                      <span className="payment-label">
                        <i className="payment-icon">💳</i>
                        Банковская карта
                      </span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={handleChange}
                      />
                      <span className="payment-label">
                        <i className="payment-icon">💵</i>
                        Наличными при получении
                      </span>
                    </label>
                  </div>
                </div>

                {orderError && <p className="error">{orderError}</p>}
                <button type="submit" className="btn btn--primary btn--large">
                  Оформить заказ
                </button>
              </form>
            </div>
          </div>

          <div className="checkout__right">
            <div className="order-summary">
              <h2>Ваш заказ</h2>
              <div className="order-items">
                {items.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Количество: {item.qty}</p>
                    </div>
                    <div className="item-price">
                      {(item.price * item.qty).toFixed(2)} ₽
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <div className="total-row">
                  <span>Итого:</span>
                  <span className="total-price">{totalPrice.toFixed(2)} ₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}