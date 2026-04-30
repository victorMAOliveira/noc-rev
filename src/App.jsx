import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import SeriesDetail from './pages/SeriesDetail.jsx'
import EpisodeDetail from './pages/EpisodeDetail.jsx'
import Watchlist from './pages/Watchlist.jsx'
import Watched from './pages/Watched.jsx'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route
            path="/series/:id/season/:seasonNumber/episode/:episodeNumber"
            element={<EpisodeDetail />}
          />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/watched" element={<Watched />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <span>
          Data provided by{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            TMDB
          </a>
          . This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </footer>
    </div>
  )
}
