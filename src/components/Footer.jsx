import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          🌿 <strong>FreshMarket</strong>
          <p>Свежие продукты прямо к вашему столу</p>
        </div>
        <div className="footer__links">
          <span>О нас</span>
          <span>Доставка</span>
          <span>Возврат</span>
          <span>Контакты</span>
        </div>
        <p className="footer__copy">© 2025 FreshMarket. All rights reserved.</p>
      </div>
    </footer>
  );
}
