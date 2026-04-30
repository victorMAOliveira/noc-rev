import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { tmdb, hasApiKey } from '../api/tmdb.js'
import SeriesCard from '../components/SeriesCard.jsx'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!q.trim()) {
      setResults([])
      return
    }
    if (!hasApiKey()) {
      setError('No TMDB API key configured (see README).')
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    tmdb
      .search(q)
      .then((data) => !cancelled && setResults(data.results || []))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [q])

  return (
    <div>
      <h1 className="page-title">
        {q ? `Results for "${q}"` : 'Search series'}
      </h1>
      {error && <div className="error">{error}</div>}
      {loading && <div className="muted">Searching…</div>}
      {!loading && q && results.length === 0 && !error && (
        <div className="empty-state">No series found.</div>
      )}
      <div className="grid">
        {results.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
    </div>
  )
}
