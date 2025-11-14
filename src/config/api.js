// API Configuration for Frontend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lvs-machine-tools-4.onrender.com';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  PRODUCTS: {
    ALL: `${API_BASE_URL}/api/products`,
    BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
    BY_CATEGORY: (category) => `${API_BASE_URL}/api/products/category/${category}`,
  },
  CATEGORIES: {
    ALL: `${API_BASE_URL}/api/categories`,
  },
  ORDERS: {
    ALL: `${API_BASE_URL}/api/orders`,
    BY_ID: (id) => `${API_BASE_URL}/api/orders/${id}`,
    BY_USER: (userId) => `${API_BASE_URL}/api/orders/user/${userId}`,
    TRACK: (orderId) => `${API_BASE_URL}/api/orders/track/${orderId}`,
  },
  CART: {
    ALL: `${API_BASE_URL}/api/cart`,
    ADD: `${API_BASE_URL}/api/cart/add`,
    REMOVE: `${API_BASE_URL}/api/cart/remove`,
    UPDATE: `${API_BASE_URL}/api/cart/update`,
  },
  PAYMENT: {
    CREATE_ORDER: `${API_BASE_URL}/api/payment/create-order`,
    VERIFY: `${API_BASE_URL}/api/payment/verify`,
  },
  EMAIL: {
    CONTACT: `${API_BASE_URL}/api/email/contact`,
    RECEIPT: `${API_BASE_URL}/api/email/receipt`,
  }
};

export default API_ENDPOINTS;