const BASE_URL = "https://fakestoreapi.com";

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Не удалось загрузить товары");
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Товар не найден");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error("Не удалось загрузить категории");
  return res.json();
}

export async function fetchProductsByCategory(category) {
  const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("Не удалось загрузить категорию");
  return res.json();
}
