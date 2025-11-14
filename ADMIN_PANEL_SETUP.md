# LVS Admin Panel Integration

The admin panel has been successfully integrated with your main e-commerce backend. Here's how everything is connected:

## 🏗️ **Architecture**

### Backend Integration
- **Main Backend**: `c:\machine and tools website\backend\server.js` (Port 5000)
- **Admin Routes**: Added to main backend under `/api/admin/`
- **Database**: Shared MongoDB database between main app and admin panel

### Admin Routes Available
- `/api/admin/products` - Product management
- `/api/admin/orders` - Order management  
- `/api/admin/customers` - Customer management
- `/api/admin/categories` - Category management
- `/api/admin/dashboard` - Dashboard statistics

## 🚀 **How to Start Everything**

### Option 1: Use the Batch Script
```bash
# Double-click the batch file
start-all-services.bat
```

### Option 2: Manual Start
```bash
# 1. Start main backend
cd "c:\machine and tools website\backend"
npm start

# 2. Start admin panel (new terminal)
cd "c:\machine and tools website\lvs-admin-panel"
npm run dev

# 3. Start main frontend (new terminal)
cd "c:\machine and tools website"
npm run dev
```

## 🌐 **Access Points**

- **Main Website**: http://localhost:5174 (or assigned port)
- **Admin Panel**: http://localhost:5173 (or assigned port)  
- **Backend API**: http://localhost:5000

## 📊 **Admin Panel Features**

### Dashboard
- Total products, orders, customers, categories
- Revenue statistics
- Recent orders
- Monthly revenue charts
- Low stock alerts

### Product Management
- View all products with category info
- Create new products
- Edit existing products
- Delete products (single/bulk)
- Product image management

### Order Management
- View all orders with pagination
- Filter by status (pending, shipped, delivered, etc.)
- Update order status
- View order details
- Customer information

### Customer Management
- View all customers
- Search customers by name/email
- View customer order history
- Customer spending statistics
- Update customer information

### Category Management
- View all categories
- Create new categories
- Edit categories
- Delete categories (if no products)
- Product count per category

## 🔧 **Configuration**

### Environment Variables
The admin panel uses these environment variables (in `lvs-admin-panel/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=LVS Admin Panel
VITE_APP_VERSION=1.0.0
```

### Database Connection
The admin panel uses the same MongoDB connection as your main application.

## 🔒 **Security Notes**

- Admin routes should be protected with authentication in production
- Consider adding role-based access control
- Implement proper input validation
- Use HTTPS in production

## 🛠️ **Development**

### Adding New Admin Features
1. Create route in `backend/routes/admin/`
2. Add to `backend/server.js`
3. Update `lvs-admin-panel/src/services/api.js`
4. Create/update admin panel pages

### Database Models
The admin panel uses your existing models:
- `backend/models/Product.js`
- `backend/models/Order.js`
- `backend/models/User.js`
- `backend/models/Category.js`

## 📋 **API Endpoints**

### Products
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Orders
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get single order
- `PUT /api/admin/orders/:id/status` - Update order status

### Customers
- `GET /api/admin/customers` - Get all customers
- `GET /api/admin/customers/:id` - Get customer details
- `PUT /api/admin/customers/:id` - Update customer

### Categories
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/health` - Get system health

## 🆘 **Troubleshooting**

### Common Issues
1. **Port conflicts**: Admin panel may start on different port (5173, 5175, etc.)
2. **Database connection**: Ensure MongoDB is running
3. **CORS errors**: Check backend CORS configuration
4. **API errors**: Check backend server logs

### Log Locations
- Backend logs: Terminal where you started `npm start`
- Admin panel logs: Browser console (F12)
- Network requests: Browser Network tab

## ✅ **Verification**

To verify everything is working:
1. Start all services using the batch file
2. Open admin panel in browser
3. Navigate through different admin pages
4. Create a test product
5. Check if it appears in main website

Your admin panel is now fully integrated and ready to use! 🎉