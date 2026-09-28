/**
 * src/utils/auth.js
 * Centralized Authentication & Storage Utilities
 */

export function isJwtExpired(token) {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

export function getStoredToken() {
  const token =
    localStorage.getItem("pacific_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("pacific_token") ||
    sessionStorage.getItem("token");

  if (!token) return null;

  if (isJwtExpired(token)) {
    clearStoredAuth();
    return null;
  }

  return token;
}

export function getStoredUser() {
  const token = getStoredToken();
  if (!token) return null;

  const storedUser =
    localStorage.getItem("pacific_user") ||
    localStorage.getItem("user") ||
    sessionStorage.getItem("pacific_user") ||
    sessionStorage.getItem("user");

  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser);
    return { ...user, token };
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  localStorage.removeItem("pacific_token");
  localStorage.removeItem("pacific_user");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("pacific_token");
  sessionStorage.removeItem("pacific_user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.dispatchEvent(new Event("pacific_auth_change"));
}

export function setStoredAuth(token, user) {
  if (token) localStorage.setItem("pacific_token", token);
  if (user) localStorage.setItem("pacific_user", JSON.stringify(user));
  window.dispatchEvent(new Event("pacific_auth_change"));
}

