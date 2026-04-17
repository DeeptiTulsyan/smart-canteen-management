export const API = {
  GATEWAY: import.meta.env.VITE_API_GATEWAY || "http://localhost:5000",
};

export const STORAGE_KEYS = {
  TOKEN: "canteen_token",
  CART: "canteen_cart",
  ADMIN_TOKEN: "canteen_admin_token",
};
