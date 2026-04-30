# NocRev

A Letterboxd-style tracker for TV series and individual episodes. Built with React + Vite and powered by TMDB.

## Features

- Browse trending and popular series from TMDB
- Drill into a series → see seasons → see every episode
- Rate series and individual episodes (1–5 stars, half-stars supported)
- Write text reviews per series and per episode
- Watchlist (to-watch) and Watched tracking
- Search by title, filter watched/watchlist by rating

All your ratings, reviews, and lists are stored in `localStorage`, so they stay on your machine.

## Setup

1. Install Node.js 18+ if you don't already have it.
2. Install dependencies:
   ```
   npm install
   ```
3. Get a free TMDB API key:
   - Create an account at https://www.themoviedb.org/
   - Go to Settings → API → Request an API key (the free "Developer" key is fine)
4. Copy `.env.example` to `.env` and paste your key:
   ```
   VITE_TMDB_API_KEY=abc123...
   ```
5. Start the dev server:
   ```
   npm run dev
   ```
   The app opens at http://localhost:5173

## Project structure

```
src/
├── api/tmdb.js              TMDB API client
├── context/UserDataContext  Ratings, reviews, watchlist (localStorage)
├── components/              Reusable UI pieces
├── pages/                   Route-level views
├── utils/storage.js         localStorage helpers
├── App.jsx                  Routes
├── main.jsx                 Entry point
└── index.css                Global styles (dark theme)
```

## Tech notes

- Data is fetched live from TMDB on each navigation (no caching layer yet — easy to add).
- User data (ratings/reviews/watched/watchlist) lives in `localStorage` under the `seriesboxd:*` namespace.
- No backend required.
