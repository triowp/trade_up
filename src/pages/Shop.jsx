import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchProductsByCategory, fetchCategories } from "../api/products";
import ProductCard from "../components/ProductCard";
import { Loader, ErrorMsg } from "../components/Loader";
import "./Shop.css";

const SORT_OPTIONS = [
  { value: "default", label: "По умолчанию" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "rating", label: "По рейтингу" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fn =
      activeCategory === "all"
        ? fetchProducts
        : () => fetchProductsByCategory(activeCategory);
    fn()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    return list;
  }, [products, search, sort]);

  const setCategory = (cat) => {
    if (cat === "all") setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div className="shop">
      <div className="shop__header">
        <h1>Магазин</h1>
        <p>{filtered.length} товаров</p>
      </div>

      {/* Filters bar */}
      <div className="shop__bar">
        <div className="shop__categories">
          <button
            className={`shop__cat-btn ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setCategory("all")}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`shop__cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="shop__controls">
          <input
            type="search"
            placeholder="🔍 Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shop__search"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="shop__sort"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loader text="Загружаем каталог..." />}
      {error && <ErrorMsg message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <div className="shop__empty">😕 Ничего не найдено</div>
      )}
      {!loading && !error && (
        <div className="shop__grid">
          {filtered.map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${(i % 12) * 0.05}s` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
