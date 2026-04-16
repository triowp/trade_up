import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import { Loader, ErrorMsg } from "../components/Loader";
import "./Home.css";

const CATEGORIES = [
  { name: "electronics", label: "Электроника", emoji: "⚡" },
  { name: "jewelery", label: "Украшения", emoji: "💎" },
  { name: "men's clothing", label: "Мужская одежда", emoji: "👔" },
  { name: "women's clothing", label: "Женская одежда", emoji: "👗" },
];

export default function Home() {
  const { data: products, loading, error } = useFetch(fetchProducts, []);
  const featured = products?.slice(0, 4) || [];

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">🌿 Натуральные продукты</p>
          <h1 className="hero__title">
            Свежее качество<br />
            <em>прямо к вам</em>
          </h1>
          <p className="hero__sub">
            Тысячи товаров с быстрой доставкой. Только лучшие бренды.
          </p>
          <div className="hero__btns">
            <Link to="/shop" className="btn btn--primary">Перейти в магазин →</Link>
            <Link to="/about" className="btn btn--ghost">Узнать больше</Link>
          </div>
        </div>
        <div className="hero__decor">
          <div className="hero__circle c1" />
          <div className="hero__circle c2" />
          <span className="hero__emoji">🛍️</span>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <div className="section-header">
          <h2>Категории</h2>
          <Link to="/shop">Смотреть все →</Link>
        </div>
        <div className="categories__grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="cat-card"
            >
              <span className="cat-card__emoji">{cat.emoji}</span>
              <span className="cat-card__label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured">
        <div className="section-header">
          <h2>Популярные товары</h2>
          <Link to="/shop">Все товары →</Link>
        </div>
        {loading && <Loader text="Загружаем товары..." />}
        {error && <ErrorMsg message={error} />}
        {!loading && !error && (
          <div className="products-grid">
            {featured.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BANNER */}
      <section className="banner">
        <div className="banner__content">
          <h2>Бесплатная доставка<br />от 3 000 ₽</h2>
          <p>Закажите сегодня — получите завтра</p>
          <Link to="/shop" className="btn btn--white">Сделать заказ</Link>
        </div>
      </section>
    </div>
  );
}
