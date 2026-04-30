import { useEffect, useState } from 'react'
import { tmdb, hasApiKey } from '../api/tmdb.js'
import SeriesCard from '../components/SeriesCard.jsx'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    if (!hasApiKey()) {
      setError(
        'No TMDB API key configured. Copy .env.example to .env and set VITE_TMDB_API_KEY, then restart `npm run dev`.',
      )
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([tmdb.trending(), tmdb.popular()])
      .then(([t, p]) => {
        if (cancelled) return
        setTrending(t.results || [])
        setPopular(p.results || [])
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <h1 className="page-title">Discover series</h1>
      {error && <div className="error">{error}</div>}
      {loading && !error && <div className="muted">Loading…</div>}

      {trending.length > 0 && (
        <>
          <h2 className="section-title">Trending this week</h2>
          <div className="grid">
            {trending.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        </>
      )}

      {popular.length > 0 && (
        <>
          <h2 className="section-title">Popular</h2>
          <div className="grid">
            {popular.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
