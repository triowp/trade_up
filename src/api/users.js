const BASE_URL = "/api";

async function handleResponse(res) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || "Серверная ошибка");
  }
  return body;
}

export async function fetchSupplierProducts(supplierId) {
  const res = await fetch(`${BASE_URL}/supplier-products?supplierId=${encodeURIComponent(supplierId)}`);
  return handleResponse(res);
}

export async function createSupplierProduct(product) {
  const res = await fetch(`${BASE_URL}/supplier-products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return handleResponse(res);
}

export async function deleteSupplierProduct(productId) {
  const res = await fetch(`${BASE_URL}/supplier-products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || "Серверная ошибка");
  }
  return true;
}
