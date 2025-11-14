
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const orderService = {
  // Get all orders (admin)
  getAllOrders: async (params = {}) => {
    const response = await api.get('/api/admin/orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/api/admin/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/api/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Get order stats
  getOrderStats: async () => {
    const response = await api.get('/api/admin/orders/stats/dashboard');
    return response.data;
  },

  // Send invoice
  sendInvoice: async (id) => {
    const response = await api.post(`/api/email/send-invoice`, { orderId: id });
    return response.data;
  }
};

export const productService = {
  // Get all products
  getAllProducts: async () => {
    const response = await api.get('/api/admin/products');
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/api/admin/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post('/api/admin/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/admin/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/api/admin/products/${id}`);
    return response.data;
  },

  // Bulk delete products
  bulkDeleteProducts: async (productIds) => {
    const response = await api.post('/api/admin/products/bulk-delete', { productIds });
    return response.data;
  }
};

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/api/admin/categories');
    return response.data;
  },

  // Get single category
  getCategory: async (id) => {
    const response = await api.get(`/api/admin/categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await api.post('/api/admin/categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/api/admin/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/api/admin/categories/${id}`);
    return response.data;
  }
};

export const customerService = {
  // Get all customers
  getAllCustomers: async (params = {}) => {
    const response = await api.get('/api/admin/customers', { params });
    return response.data;
  },

  // Get single customer
  getCustomer: async (id) => {
    const response = await api.get(`/api/admin/customers/${id}`);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/api/admin/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await api.delete(`/api/admin/customers/${id}`);
    return response.data;
  },

  // Get customer stats
  getCustomerStats: async () => {
    const response = await api.get('/api/admin/customers/stats/dashboard');
    return response.data;
  }
};

export const emailService = {
  // Get all emails
  getAllEmails: async () => {
    const response = await api.get('/api/email/admin/emails');
    return response.data;
  },

  // Get email by ID
  getEmailById: async (id) => {
    const response = await api.get(`/api/email/admin/emails/${id}`);
    return response.data;
  },

  // Resend email
  resendEmail: async (id) => {
    const response = await api.post(`/api/email/admin/emails/${id}/resend`);
    return response.data;
  },

  // Delete email
  deleteEmail: async (id) => {
    const response = await api.delete(`/api/email/admin/emails/${id}`);
    return response.data;
  },

  // Send test email
  sendTestEmail: async (emailData) => {
    const response = await api.post('/api/email/test', emailData);
    return response.data;
  },

  // Get email settings
  getEmailSettings: async () => {
    const response = await api.get('/api/email/admin/settings');
    return response.data;
  },

  // Update email settings
  updateEmailSettings: async (settings) => {
    const response = await api.put('/api/email/admin/settings', settings);
    return response.data;
  }
};



export const dashboardService = {
  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
  },

  // Get system health
  getHealth: async () => {
    const response = await api.get('/api/admin/dashboard/health');
    return response.data;
  }
};

// Export the axios instance for direct use
export default api;
