# 🎬 AniStream

A modern, high-performance anime streaming application with a sleek anime-themed UI inspired by Crunchyroll. Built with React and Node.js, featuring intelligent caching, offline support, and a beautiful responsive design.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

---

## ✨ Features

### 🎯 Core Functionality
- **Anime Discovery**: Browse trending, top-rated, and newly released anime
- **Advanced Search**: Search across multiple anime databases (Jikan & Kitsu APIs)
- **Genre Filtering**: Explore anime by genre with dynamic filtering
- **Seasonal Content**: Discover seasonal and upcoming anime releases
- **Detailed Information**: View comprehensive anime details, ratings, and descriptions
- **Video Streaming**: Built-in HLS video player with quality selection

### 🚀 Performance & Optimization
- **Intelligent Caching**: Backend caching reduces API calls by 80% (5-minute TTL)
- **Lazy Loading**: Image and component lazy loading for improved performance
- **Service Worker**: Offline support and PWA capabilities
- **Rate Limiting**: Backend protection against excessive requests
- **Optimized Assets**: WebP image support with fallbacks

### 📱 User Experience
- **Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **Modern UI**: Sleek, anime-themed design with smooth animations
- **Dark Mode**: Crunchyroll-inspired color palette
- **Interactive Elements**: Hover effects, smooth transitions, and micro-animations
- **Community Features**: Discussion boards and watchlist management

### 🔐 User Management
- **Authentication**: JWT-based authentication with refresh tokens
- **User Profiles**: Personalized watchlists and preferences
- **Secure Sessions**: Cookie-based session management with bcrypt password hashing

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.1.0 with Vite
- **Styling**: TailwindCSS 4.1.11 with custom anime theme
- **State Management**: TanStack React Query for server state
- **Routing**: React Router DOM 7.6.2
- **Video Player**: Video.js + HLS.js for adaptive streaming
- **Animations**: Framer Motion for smooth animations
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Express 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Caching**: Node-cache for in-memory caching
- **APIs**: Axios for external API integration
- **Security**: CORS, cookie-parser

### External APIs
- **Jikan API**: MyAnimeList data integration
- **Kitsu API**: Additional anime metadata and content

---

## 📁 Project Structure

```
m-2/
├── Backend-neco/           # Backend API server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── db/                 # Database connection
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic & external API services
│   ├── utils/              # Utility functions
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   └── package.json
│
└── Frontend/               # React frontend application
    ├── public/             # Static assets
    │   ├── sw.js           # Service worker
    │   └── manifest.json   # PWA manifest
    ├── src/
    │   ├── assets/         # Images and media
    │   ├── components/     # Reusable React components
    │   ├── Home/           # Homepage components
    │   ├── ExplorePage/    # Explore page components
    │   ├── Layout/         # Layout components
    │   ├── services/       # API service layer
    │   ├── hooks/          # Custom React hooks
    │   ├── App.jsx         # Main App component
    │   └── main.jsx        # Application entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kapilsingh09/AniStream.git
   cd m-2
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend-neco
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

### Environment Configuration

1. **Backend Environment Variables**
   
   Create `.env` file in `Backend-neco/` directory:
   ```bash
   cp env.example .env
   ```
   
   Update the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/anime-app
   
   # JWT Secrets (change these!)
   ACCESS_TOKEN_SECRET=your-secret-access-token-key
   REFRESH_TOKEN_SECRET=your-secret-refresh-token-key
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   
   # CORS
   CORS_ORIGIN=http://localhost:5173
   
   # Cache
   CACHE_TTL=300
   CACHE_CHECK_PERIOD=120
   
   # External APIs
   JIKAN_API_URL=https://api.jikan.moe/v4
   KITSU_API_URL=https://kitsu.io/api/edge
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

2. **Frontend Environment Variables**
   
   Create `.env` file in `Frontend/` directory:
   ```bash
   cp env.example .env
   ```
   
   Update the following variables:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=AniStream
   VITE_APP_VERSION=1.0.0
   VITE_NODE_ENV=development
   
   # Feature Flags
   VITE_ENABLE_ANALYTICS=false
   VITE_ENABLE_PWA=true
   VITE_ENABLE_OFFLINE_MODE=true
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd Backend-neco
   npm run dev
   ```
   Backend will run on `http://localhost:3000`

3. **Start Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Access the Application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Anime Data (Unified API)
- `GET /api/unified/trending` - Get trending anime
- `GET /api/unified/top-rated` - Get top-rated anime
- `GET /api/unified/new-arrivals` - Get new arrivals
- `GET /api/unified/genre/:genre` - Get anime by genre
- `GET /api/unified/search?q=query` - Search anime
- `GET /api/unified/details/:id` - Get anime details

### Utility
- `GET /health` - Health check endpoint

---

## 🎨 Design System

### Color Palette (Anime Theme)
```css
/* Primary Colors */
--primary: #FF6B6B (Anime Red)
--secondary: #4ECDC4 (Teal)
--accent: #FFE66D (Yellow)

/* Background */
--bg-dark: #0F1419
--bg-card: #181C20
--bg-hover: #1F2328

/* Text */
--text-primary: #E8E8E8
--text-secondary: #9CA3AF
--text-muted: #6B7280
```

### Responsive Breakpoints
- **Mobile**: < 768px (horizontal scroll layout)
- **Tablet**: 768px - 1024px (3-column grid)
- **Desktop**: > 1024px (6-column grid)

---

## 🧩 Key Components

### Frontend Components

#### `AnimeCard`
Unified, reusable anime card component with multiple variants:
- `default`: Standard card with image and title
- `compact`: Minimal card for mobile
- `detailed`: Full details with description
- `banner`: Large banner format

#### `ResponsiveAnimeGrid`
Flexible grid system that automatically adjusts columns based on screen size with loading states and error handling.

#### `AnimeSection`
Pre-configured section components for different content types (trending, top-rated, genre-based).

#### `OptimizedAnimeCard`
Performance-optimized version with lazy loading and image optimization.

### Backend Services

#### `unifiedAnimeService`
Centralized service that:
- Combines Jikan and Kitsu APIs
- Implements intelligent caching
- Normalizes data structures
- Handles errors with fallbacks

---

## 🔧 Development

### Available Scripts

#### Backend
```bash
npm start        # Start production server
npm run dev      # Start development server
npm test         # Run tests
```

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Architecture

#### Frontend Architecture
- **Component-Based**: Modular, reusable components
- **React Query**: Server state management with caching
- **Custom Hooks**: Reusable logic (usePerformance, etc.)
- **Service Layer**: Centralized API calls

#### Backend Architecture
- **MVC Pattern**: Models, Views (JSON), Controllers
- **Service Layer**: Business logic separation
- **Middleware**: Authentication, rate limiting, error handling
- **Caching Strategy**: Cache-first for frequently accessed data

---

## 🌟 Performance Optimizations

1. **Backend Caching**: 80% reduction in external API calls
2. **Lazy Loading**: Components and images load on-demand
3. **Code Splitting**: Automatic route-based splitting with Vite
4. **Image Optimization**: WebP format with fallbacks
5. **Service Worker**: Offline caching and PWA support
6. **Debounced Search**: Reduced API calls during search
7. **Virtual Scrolling**: Efficient rendering of large lists

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configurable CORS policies
- **Rate Limiting**: Protection against DDoS and abuse
- **Input Validation**: Sanitized user inputs
- **Secure Cookies**: HttpOnly cookies for sessions

---

## 📱 PWA Features

- **Installable**: Can be installed as a native app
- **Offline Support**: Service worker caching
- **App Shortcuts**: Quick access to trending, search, favorites
- **Share Target**: Share content to the app
- **Push Notifications**: Ready for notification implementation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Kapil Singh**
- GitHub: [@kapilsingh09](https://github.com/kapilsingh09)

---

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) - MyAnimeList data
- [Kitsu API](https://kitsu.io/) - Anime metadata
- [Crunchyroll](https://www.crunchyroll.com/) - Design inspiration
- React and Vite teams for amazing tools

---

## 📞 Support

If you have any questions or need help, please:
- Open an [issue](https://github.com/kapilsingh09/AniStream/issues)
- Contact via GitHub

---

## 🗺️ Roadmap

- [ ] User reviews and ratings
- [ ] Social features (friends, sharing)
- [ ] Personalized recommendations
- [ ] Watch history tracking
- [ ] Multiple language support
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced filtering and sorting
- [ ] Integration with more anime databases

---

<div align="center">

**Made with ❤️ for anime lovers**

</div>
