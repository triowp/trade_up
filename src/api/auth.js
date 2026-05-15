const BASE_URL = "/api";

async function handleResponse(res) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || "Серверная ошибка");
  }
  return body;
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

export async function updateProfile(userId, updates) {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  return handleResponse(res);
}

export async function verifySupplier(userId) {
  const res = await fetch(`${BASE_URL}/users/${userId}/verify`, {
    method: "POST",
  });
  return handleResponse(res);
}
