import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { items, removeFromCart, updateQty, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <span>🛒</span>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
        <Link to="/shop" className="cart-empty__btn">Перейти в магазин</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__header">
        <h1>Корзина</h1>
        <button className="cart__clear" onClick={clearCart}>Очистить всё</button>
      </div>

      <div className="cart__layout">
        <div className="cart__items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__img-wrap">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="cart-item__info">
                <Link to={`/product/${item.id}`} className="cart-item__title">
                  {item.title}
                </Link>
                <span className="cart-item__category">{item.category}</span>
                <span className="cart-item__price">${item.price.toFixed(2)}</span>
              </div>
              <div className="cart-item__controls">
                <div className="qty-control">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <span className="cart-item__subtotal">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
                <button
                  className="cart-item__remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Удалить"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart__summary">
          <h2>Итого</h2>
          <div className="cart__summary-rows">
            <div className="cart__row">
              <span>Товары ({items.reduce((s, i) => s + i.qty, 0)} шт.)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart__row">
              <span>Доставка</span>
              <span className="free">{totalPrice > 50 ? "Бесплатно" : "$4.99"}</span>
            </div>
            <div className="cart__row cart__total">
              <span>К оплате</span>
              <span>${(totalPrice > 50 ? totalPrice : totalPrice + 4.99).toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="cart__checkout">Оформить заказ →</Link>
          <Link to="/shop" className="cart__continue">← Продолжить покупки</Link>
        </div>
      </div>
    </div>
  );
}
