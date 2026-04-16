import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const CATEGORY_EMOJI = {
  "electronics": "⚡",
  "jewelery": "💎",
  "men's clothing": "👔",
  "women's clothing": "👗",
};

export default function ProductCard({ product }) {
  const { addToCart, items } = useCart();
  const inCart = items.some((i) => i.id === product.id);

  return (
    <div className="pcard">
      <Link to={`/product/${product.id}`} className="pcard__img-wrap">
        <img src={product.image} alt={product.title} className="pcard__img" loading="lazy" />
        <span className="pcard__category">
          {CATEGORY_EMOJI[product.category] || "🏷️"} {product.category}
        </span>
      </Link>

      <div className="pcard__body">
        <Link to={`/product/${product.id}`} className="pcard__title">
          {product.title}
        </Link>

        <div className="pcard__rating">
          <span className="pcard__stars">
            {"★".repeat(Math.round(product.rating?.rate || 0))}
            {"☆".repeat(5 - Math.round(product.rating?.rate || 0))}
          </span>
          <span className="pcard__count">({product.rating?.count})</span>
        </div>

        <div className="pcard__footer">
          <span className="pcard__price">${product.price.toFixed(2)}</span>
          <button
            className={`pcard__btn ${inCart ? "in-cart" : ""}`}
            onClick={() => addToCart(product)}
          >
            {inCart ? "✓ В корзине" : "+ В корзину"}
          </button>
        </div>
      </div>
    </div>
  );
}
