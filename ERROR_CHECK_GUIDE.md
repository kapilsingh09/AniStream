# 🔍 Error Checking Guide - Watchlist Feature

## ⚠️ Common Backend Errors to Check

### 1. Import Errors
**Location**: `Backend-neco/routes/watchlist.routes.js`  
**Check**:
```javascript
✅ import { verify_JWT } from "../middlewares/auth.middlewares.js";
✅ import { addToWatchlist, ... } from "../controllers/watchlist.controller.js";
```

### 2. Middleware Errors
**Location**: `Backend-neco/middlewares/auth.middlewares.js`  
**Verify**: Middleware exports `verify_JWT` correctly

### 3. Model Errors
**Location**: `Backend-neco/models/user.model.js`  
**Check**: Watchlist field is properly added:
```javascript
watchlist: [{
    animeId: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
}]
```

### 4. Route Registration
**Location**: `Backend-neco/app.js`  
**Check**:
```javascript
✅ import watchlistRoutes from './routes/watchlist.routes.js'
✅ app.use("/api/watchlist", watchlistRoutes);
```

### 5. Controller Errors
**Location**: `Backend-neco/controllers/watchlist.controller.js`  
**Check**:
- All functions use `asyncHandler`
- All use `ApiResponse` for success
- All use `ApiError` for errors
- User is retrieved from `req.user._id`

---

## ⚠️ Common Frontend Errors to Check

### 1. Context Provider
**Location**: `Frontend/src/main.jsx`  
**Check**:
```javascript
✅ import { WatchlistProvider } from './context/WatchlistContext.jsx'
✅ <WatchlistProvider> wraps the app
```

### 2. Context Usage
**Location**: `Frontend/src/context/WatchlistContext.jsx`  
**Check**:
- API URL: `http://localhost:3000/api/watchlist/`
- Token retrieval from localStorage
- Error handling in place

### 3. Component Imports
**Location**: `Frontend/src/components/WatchlistButton.jsx`  
**Check**:
```javascript
✅ import { useWatchlist } from '../context/WatchlistContext'
✅ import { useAuth } from '../context/AuthContext'
```

### 4. Route Registration
**Location**: `Frontend/src/App.jsx`  
**Check**:
```javascript
✅ import MyWatchlist from './pages/MyWatchlist'
✅ <Route path="/watchlist" element={<MyWatchlist />} />
```

### 5. Anime Page Integration
**Locations**: 
- `Frontend/src/routes/KitsuAnimeCard.jsx`
- `Frontend/src/routes/JikhanAnimeCard.jsx`

**Check**:
- WatchlistButton imported
- Props passed correctly (animeId, title, image)
- Button renders correctly

---

## 🧪 Testing Checklist

### Backend Testing
```bash
# Test endpoint with curl or Postman
curl -X POST http://localhost:3000/api/watchlist/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"animeId":"123","title":"Test","image":"https://example.com/img.jpg"}'
```

### Frontend Testing
1. ✅ Open browser console (F12)
2. ✅ Navigate to anime page
3. ✅ Click watchlist button
4. ✅ Check Network tab for API calls
5. ✅ Check for console errors

---

## 🐛 Debugging Steps

### If Watchlist Button Doesn't Work:
1. Check browser console for errors
2. Verify user is logged in
3. Check Network tab - is API call being made?
4. Check API response status code
5. Verify token is valid

### If API Returns 401:
1. Check if token exists in localStorage
2. Verify token format (should start with "Bearer ")
3. Check backend middleware logs
4. Verify JWT_SECRET matches

### If API Returns 404:
1. Check route registration in app.js
2. Verify MongoDB connection
3. Check user exists in database
4. Verify animeId format

### If Watchlist Empty:
1. Check MongoDB - does user have watchlist field?
2. Verify API returns data correctly
3. Check WatchlistContext fetchWatchlist function
4. Check browser console for errors

---

## 🔧 Quick Fixes

### Fix: "Cannot read property 'watchlist' of undefined"
**Solution**: Ensure user is logged in before accessing watchlist

### Fix: "Network Error"
**Solution**: 
- Check backend server is running
- Verify CORS settings in app.js
- Check API URL is correct

### Fix: "Watchlist button not showing"
**Solution**:
- Check import statement
- Verify component renders
- Check conditional rendering logic

### Fix: "Duplicate entry error"
**Solution**: This is expected! Check if anime exists before adding

---

## 📋 Verification Commands

### Backend
```bash
# Check if route is registered
grep -r "watchlist" Backend-neco/app.js

# Check controller exports
grep -r "export const" Backend-neco/controllers/watchlist.controller.js

# Check routes
cat Backend-neco/routes/watchlist.routes.js
```

### Frontend
```bash
# Check context provider
grep -r "WatchlistProvider" Frontend/src/main.jsx

# Check route
grep -r "/watchlist" Frontend/src/App.jsx

# Check component usage
grep -r "WatchlistButton" Frontend/src/routes/
```

---

## ✅ Final Checklist

- [ ] Backend server starts without errors
- [ ] All routes are accessible
- [ ] JWT middleware works correctly
- [ ] MongoDB connection is active
- [ ] Frontend compiles without errors
- [ ] WatchlistButton renders correctly
- [ ] MyWatchlist page loads
- [ ] API calls succeed (check Network tab)
- [ ] No console errors
- [ ] Watchlist persists after refresh

---

## 🆘 Still Having Issues?

1. **Check Backend Logs**: Look for error messages in terminal
2. **Check Browser Console**: Look for JavaScript errors
3. **Check Network Tab**: Verify API requests/responses
4. **Verify Dependencies**: Ensure all packages installed
5. **Database Check**: Verify MongoDB is running and connected

---

*For detailed error messages, check:*
- Browser console (F12)
- Backend terminal output
- Network tab in DevTools
- MongoDB logs (if applicable)

