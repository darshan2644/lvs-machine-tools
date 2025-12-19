# LVS Machine Tools E-commerce Website

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
   git clone https://github.com/darshan2644/lvs-machine-tools.git
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

**Built with for LVS Machine Tools**
