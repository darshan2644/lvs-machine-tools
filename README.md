# LVS Machine Tools - E-commerce Website

A fully responsive, modern e-commerce website for LVS Machine Tools built with the MERN stack (MongoDB, Express.js, React, Node.js) using Vite for fast development.

## 🚀 Featur# LVS Machine Tools E-commerce Website

A modern MERN stack e-commerce website for LVS Machine Tools, specializing in professional CNC machines, jewelry making equipment, and industrial machinery.

![LVS Machine Tools](./images/lvs-logo.png)

## 🚀 Features

### 🛍️ E-commerce Functionality
- Product catalog with detailed specifications
- Category-based product filtering
- Individual product detail pages
- Search functionality
- Responsive product cards

### 🔐 User Authentication
- User registration and login
- Protected routes
- User profile management
- Firebase authentication integration

### 📱 Modern Design
- Dark theme with gold accents (#FFD700)
- Mobile-first responsive design
- Professional industrial aesthetic
- Smooth animations and transitions

### 🏭 Product Categories
- CNC Bangle And Ring Cutting Machine
- Faceting Machine
- Pendent And Ring Engraving & Cutting Machine
- Dough Balls Cutting Machine
- Jewellery Cutting Machine
- Jewellery Engraving Machine

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Custom CSS** - Responsive styling (No Tailwind)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **MongoDB ready** - Database integration ready

### Tools & Services
- **Firebase** - Authentication service
- **Git** - Version control
- **VS Code** - Development environment

## 📂 Project Structure

```
machine-and-tools-website/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation component
│   │   ├── Footer.jsx          # Footer component
│   │   └── *.css               # Component styles
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page
│   │   ├── ProductsPage.jsx    # All products listing
│   │   ├── ProductDetailPage.jsx # Individual product details
│   │   ├── CategoriesPage.jsx  # Product categories
│   │   ├── LoginPage.jsx       # User login
│   │   ├── SignupPage.jsx      # User registration
│   │   └── *.css               # Page styles
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context
│   └── services/
│       └── authService.js      # Authentication services
├── backend/
│   ├── server.js               # Express server
│   ├── routes/                 # API routes
│   ├── models/                 # Database models
│   └── middleware/             # Custom middleware
├── public/
│   └── images/                 # Static images
└── package.json                # Dependencies
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lvs-machine-tools.git
   cd lvs-machine-tools
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

5. **Start the development servers**
   
   **Backend server:**
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend server (in new terminal):**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products?category=slug` - Filter by category

### Categories
- `GET /api/categories` - Get all categories

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## 🎨 Design System

### Colors
- **Background**: Black (#000000, #121212)
- **Accent**: Gold Yellow (#FFD700, #FFC107)
- **Text**: White (#FFFFFF, #F1F1F1)
- **Secondary**: Gray variants

### Typography
- **Primary Font**: 'Poppins', sans-serif
- **Secondary Font**: 'Roboto', sans-serif

### Components
- Responsive grid layouts
- Hover animations
- Professional button styles
- Card-based product display

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Medium screen adaptations
- **Desktop**: Full-featured experience
- **Grid Layouts**: Flexible product grids

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Deploy with your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

**LVS Machine Tools**
- Website: [Your Website]
- Email: [Your Email]
- LinkedIn: [Your LinkedIn]

## 🙏 Acknowledgments

- React community for excellent documentation
- Unsplash for product placeholder images
- Industrial machinery manufacturers for inspiration

---

**Built with ❤️ for LVS Machine Tools**Dark Theme Design**: Modern black background with yellow (#FFD700) accents
- **Fully Responsive**: Mobile-first design that works on all devices
- **Product Categories**: 6 main categories (CNC Machines, Lathes, Milling Machines, Drill Presses, Grinders, Welding Equipment)
- **Product Showcase**: Featured products with ratings, pricing, and detailed information
- **Modern UI Components**: Custom-styled navigation, hero section, product cards, and footer
- **RESTful API**: Complete backend API for categories and products
- **Database Integration**: MongoDB with Mongoose for data management
- **Search & Filter**: Product search and filtering capabilities
- **Professional Layout**: Industry-appropriate design for machine tools business

## 🛠️ Tech Stack

### Frontend
- **React** with Vite for fast development
- **React Router** for navigation
- **Axios** for API calls
- **Custom CSS** with CSS variables for theming
- **Responsive Design** with CSS Grid and Flexbox

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **Environment variables** with dotenv

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navbar.jsx & .css
│   │   └── Footer.jsx & .css
│   ├── pages/
│   │   └── HomePage.jsx & .css
│   ├── App.jsx & .css
│   ├── index.css
│   └── main.jsx
├── server/
│   ├── models/
│   │   ├── Category.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── categories.js
│   │   └── products.js
│   ├── server.js
│   ├── seedData.js
│   ├── seed.js
│   └── .env
└── public/
    └── images/
        └── lvs-logo.svg
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud database)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd machine-and-tools-website
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lvs-tools
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure your MongoDB server is running locally or configure your cloud database URI.

6. **Seed the database**
   ```bash
   cd server
   npm run seed
   ```

7. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

8. **Start the frontend development server**
   ```bash
   # In the root directory
   npm run dev
   ```

9. **Open your browser**
   Navigate to `http://localhost:5173` to view the website.

## 📊 API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create new category

### Products
- `GET /api/products` - Get all products (with filtering and pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:categorySlug` - Get products by category
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create new product

### Query Parameters for Products
- `page` - Page number for pagination
- `limit` - Number of products per page
- `category` - Filter by category slug
- `minPrice` & `maxPrice` - Price range filter
- `brand` - Filter by brand
- `featured` - Show only featured products
- `inStock` - Show only in-stock products
- `search` - Text search in product name, description, brand, model
- `sort` - Sort by: `price-low`, `price-high`, `name`, `rating`, `newest`

## 🎨 Design Features

### Color Scheme
- **Primary Background**: #000000 (Pure Black)
- **Secondary Background**: #121212 (Dark Gray)
- **Tertiary Background**: #1a1a1a (Lighter Dark Gray)
- **Accent Color**: #FFD700 (Gold/Yellow)
- **Text Primary**: #ffffff (White)
- **Text Secondary**: #cccccc (Light Gray)

### Responsive Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 767px and below
- **Small Mobile**: 480px and below

### Key Components
- **Navbar**: Fixed navigation with search, categories dropdown, and mobile menu
- **Hero Section**: Eye-catching banner with CTAs and company statistics
- **Categories Grid**: 6 product categories with icons and descriptions
- **Featured Products**: Product cards with images, ratings, and pricing
- **Features Section**: Company benefits and service highlights
- **Footer**: Comprehensive links, contact info, and newsletter signup

## 🔧 Customization

### Adding New Categories
1. Add category data to `server/seedData.js`
2. Run `npm run seed` to update the database
3. Update the navigation dropdown in `Navbar.jsx`

### Adding New Products
1. Add product data to `server/seedData.js`
2. Ensure product images are available in `public/images/products/`
3. Run `npm run seed` to update the database

### Styling Changes
- Modify CSS variables in `src/index.css` for global theme changes
- Component-specific styles are in their respective `.css` files
- Responsive design uses CSS Grid and Flexbox

## 📱 Mobile Features

- **Responsive Navigation**: Hamburger menu for mobile devices
- **Touch-Friendly**: Optimized button sizes and spacing
- **Mobile-First Design**: Built from mobile up to desktop
- **Performance Optimized**: Fast loading on mobile networks

## 🚀 Deployment

### Frontend (Vercel, Netlify, etc.)
```bash
npm run build
```

### Backend (Heroku, DigitalOcean, etc.)
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy using `npm start`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@lvstools.com or contact us through the website.

---

**Built with ❤️ for LVS Machine Tools**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
