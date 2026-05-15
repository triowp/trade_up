const BASE_URL = "/api";

async function handleResponse(res) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || "Серверная ошибка");
  }
  return body;
}

export async function fetchOrdersByUser(userId) {
  const res = await fetch(`${BASE_URL}/orders?userId=${encodeURIComponent(userId)}`);
  return handleResponse(res);
}

export async function fetchOrdersBySupplier(supplierId) {
  const res = await fetch(`${BASE_URL}/orders?supplierId=${encodeURIComponent(supplierId)}`);
  return handleResponse(res);
}

export async function createOrder(order) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return handleResponse(res);
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}
