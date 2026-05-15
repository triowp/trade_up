const BASE_URL = "/api";

async function handleResponse(res) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || "Серверная ошибка при загрузке товаров");
  }
  return body;
}

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return handleResponse(res);
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`);
  return handleResponse(res);
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`);
  return handleResponse(res);
}

export async function fetchProductsByCategory(category) {
  const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
  return handleResponse(res);
}
