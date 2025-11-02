# AniStream

🚧 **Work in Progress** 🚧  
AniStream is a web application for browsing and streaming anime.  
The project is currently under development — more updates coming soon!

## 📺 Latest Feature: Watchlist

A complete watchlist feature has been implemented, similar to Crunchyroll's functionality. Users can now save anime to their personal watchlist and manage them easily.

### Quick Start
- **View Watchlist**: Click "Watchlist" in navbar (when logged in) or visit `/watchlist`
- **Add to Watchlist**: Click the watchlist button on any anime detail page
- **Remove from Watchlist**: Click "Remove from Watchlist" button or use the remove button on watchlist page

### Documentation
- 📖 **Full Documentation**: See [`WATCHLIST_FEATURE.md`](./WATCHLIST_FEATURE.md)
- 📝 **Changelog**: See [`CHANGELOG.md`](./CHANGELOG.md)

### New API Endpoints
- `POST /api/watchlist/add` - Add anime to watchlist
- `DELETE /api/watchlist/remove/:animeId` - Remove anime
- `GET /api/watchlist` - Get user's watchlist
- `GET /api/watchlist/check/:animeId` - Check if anime in watchlist

All endpoints require JWT authentication.