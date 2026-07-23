import { API_BASE_URL } from "../api/config.js";

export function getListaID() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
}

