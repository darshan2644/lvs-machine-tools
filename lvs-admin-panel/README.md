# LVS Machine Tools - Admin Panel

A comprehensive admin panel for managing the LVS Machine Tools e-commerce platform. Built with React, Material-UI, and Node.js.

## Features

### 📊 Dashboard
- Real-time analytics and statistics
- Sales overview with interactive charts
- Recent orders and customer activity
- Revenue tracking and trends
- Product category distribution

### 🛍️ Product Management
- Add, edit, and delete products
- Bulk product operations
- Product image management
- Category assignment
- Stock tracking
- Product search and filtering
- Grid and table view modes

### 📦 Order Management
- View all orders with detailed information
- Update order status (pending, confirmed, processing, shipped, delivered, cancelled)
- Assign estimated delivery dates
- Add tracking numbers
- Send order confirmation emails
- Print and email invoices
- Order filtering and search

### 🏷️ Category Management
- Create and manage product categories
- Hierarchical category structure (parent/child categories)
- Category images and descriptions
- SEO-friendly URL slugs
- Category sorting and organization
- Product count per category

### 👥 Customer Management
- View customer list with detailed profiles
- Customer segmentation (VIP, Premium, Regular, New)
- Order history for each customer
- Customer statistics and purchase behavior
- Block/unblock customers
- Send emails to customers
- Customer search and filtering

### 📧 Email Management
- Monitor email delivery status
- View sent, failed, and pending emails
- Resend failed emails
- Email templates management
- SMTP configuration
- Test email functionality
- Email analytics (open rates, delivery rates)

### 🔐 Authentication
- Secure admin login
- JWT-based authentication
- Session management
- Protected routes

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI (MUI)** - Professional UI components
- **React Router** - Client-side routing
- **Recharts** - Beautiful charts and analytics
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form management
- **React Toastify** - Toast notifications
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd admin-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5002
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@lvsmachinetools.com
FROM_NAME=LVS Machine Tools
```

5. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5002
VITE_APP_NAME=LVS Admin Panel
VITE_APP_VERSION=1.0.0
```

5. Start the development server:
```bash
npm run dev
```

## Usage

### Starting the Application

1. Start the backend server:
```bash
cd admin-backend
npm start
```

2. Start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Default Login Credentials
```
Email: admin@lvsmachinetools.com
Password: admin123
```

## API Endpoints

### Products
- `GET /products` - Get all products
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Orders
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `PUT /orders/:id` - Update order
- `POST /orders/:id/send-invoice` - Send invoice email

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Customers
- `GET /customers` - Get all customers
- `GET /customers/:id` - Get customer by ID
- `PUT /customers/:id` - Update customer

### Emails
- `GET /emails` - Get all emails
- `POST /emails/test` - Send test email
- `POST /emails/:id/resend` - Resend email
- `DELETE /emails/:id` - Delete email record

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## Project Structure

```
lvs-admin-panel/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── AdminLayout.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Orders.jsx
│   │   ├── Categories.jsx
│   │   ├── Customers.jsx
│   │   ├── EmailManagement.jsx
│   │   └── Login.jsx
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── admin-backend/
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── customerRoutes.js
│   │   └── emailRoutes.js
│   ├── models/
│   │   └── Product.js
│   ├── middleware/
│   ├── controllers/
│   │   └── productController.js
│   └── server.js
├── package.json
├── vite.config.js
└── README.md
```

## Features in Detail

### Dashboard Analytics
- Sales trends with line charts
- Product category distribution with pie charts
- Key performance indicators (KPIs)
- Recent activity monitoring
- Revenue tracking

### Advanced Product Management
- Bulk operations (delete, update categories)
- Product import/export (CSV)
- Image gallery management
- SEO optimization fields
- Inventory tracking
- Product variants support

### Order Processing Workflow
- Order status pipeline
- Automated email notifications
- Print shipping labels
- Track delivery status
- Customer communication logs

### Customer Insights
- Customer lifetime value (CLV)
- Purchase behavior analysis
- Segmentation based on spending
- Personalized marketing campaigns
- Customer support integration

### Email Marketing
- Email template editor
- Automated email sequences
- A/B testing for subject lines
- Email performance analytics
- Spam score checking

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Update API URL in environment variables

### Backend Deployment (Heroku/DigitalOcean)
1. Set up MongoDB Atlas or your preferred database
2. Configure environment variables
3. Deploy the backend code
4. Update frontend API URL

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5002
VITE_APP_NAME=LVS Admin Panel
VITE_APP_VERSION=1.0.0
```

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5002
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@lvsmachinetools.com
FROM_NAME=LVS Machine Tools
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Security

- JWT-based authentication
- Input validation and sanitization
- CORS configuration
- Environment variable security
- SQL injection prevention
- XSS protection

## Performance

- Lazy loading for components
- Image optimization
- API response caching
- Database query optimization
- Code splitting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary software for LVS Machine Tools.

## Support

For support, email admin@lvsmachinetools.com or create an issue in the repository.

## Changelog

### Version 1.0.0
- Initial release with full admin panel functionality
- Dashboard with analytics
- Product, order, category, and customer management
- Email management system
- Responsive design with Material-UI

## Roadmap

### Upcoming Features
- Multi-language support
- Advanced reporting and analytics
- Inventory management with low stock alerts
- Automated backup system
- Mobile app for order management
- Integration with payment gateways
- Advanced search with filters
- Bulk import/export functionality
- Customer reviews and ratings management
- SEO tools and meta tag management