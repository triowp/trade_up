import { useParams, Link } from "react-router-dom";
import { fetchProduct } from "../api/products";
import { useFetch } from "../hooks/useFetch";
import { useCart } from "../context/CartContext";
import { Loader, ErrorMsg } from "../components/Loader";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(() => fetchProduct(id), [id]);
  const { addToCart, items } = useCart();
  const inCart = items.some((i) => i.id === product?.id);

  if (loading) return <Loader text="Загружаем товар..." />;
  if (error) return <ErrorMsg message={error} />;
  if (!product) return null;

  const stars = Math.round(product.rating?.rate || 0);

  return (
    <div className="pdetail">
      <Link to="/shop" className="pdetail__back">← Вернуться в магазин</Link>

      <div className="pdetail__card">
        <div className="pdetail__img-wrap">
          <img src={product.image} alt={product.title} className="pdetail__img" />
        </div>

        <div className="pdetail__info">
          <span className="pdetail__category">{product.category}</span>
          <h1 className="pdetail__title">{product.title}</h1>

          <div className="pdetail__rating">
            <span className="pdetail__stars">
              {"★".repeat(stars)}{"☆".repeat(5 - stars)}
            </span>
            <span>{product.rating?.rate} из 5</span>
            <span className="pdetail__sep">·</span>
            <span>{product.rating?.count} отзывов</span>
          </div>

          <p className="pdetail__desc">{product.description}</p>

          <div className="pdetail__footer">
            <span className="pdetail__price">${product.price.toFixed(2)}</span>
            <button
              className={`pdetail__btn ${inCart ? "in-cart" : ""}`}
              onClick={() => addToCart(product)}
            >
              {inCart ? "✓ Добавлено в корзину" : "🛒 Добавить в корзину"}
            </button>
          </div>

          <div className="pdetail__badges">
            <span>🚚 Бесплатная доставка от 3000₽</span>
            <span>↩️ Возврат 30 дней</span>
            <span>🔒 Безопасная оплата</span>
          </div>
        </div>
      </div>
    </div>
  );
}
