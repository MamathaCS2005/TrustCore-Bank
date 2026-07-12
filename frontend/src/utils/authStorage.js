// Centralized helper for persisting the auth token/user across "Remember Me".
//
// - rememberMe = true  -> localStorage (survives browser restarts, backed by a
//                          longer-lived JWT from the backend).
// - rememberMe = false -> sessionStorage (cleared when the browser/tab closes,
//                          backed by the normal short-lived JWT).
//
// Both storages are checked on read so a session started with either option
// keeps working consistently across the app (axios interceptor, AuthContext).

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const REMEMBER_KEY = 'rememberMe';

export function saveSession(token, user, rememberMe) {
  const store = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  store.setItem(TOKEN_KEY, token);
  store.setItem(USER_KEY, JSON.stringify(user));
  store.setItem(REMEMBER_KEY, String(rememberMe));

  // Ensure no stale session lingers in the other storage.
  other.removeItem(TOKEN_KEY);
  other.removeItem(USER_KEY);
  other.removeItem(REMEMBER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(REMEMBER_KEY);
}
