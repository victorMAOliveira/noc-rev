import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserData } from '../context/UserDataContext.jsx'
import { posterUrl } from '../api/tmdb.js'
import StarRating from '../components/StarRating.jsx'

export default function Watchlist() {
  const { watchlist, getRating, seriesKey, toggleWatchlist } = useUserData()
  const [sort, setSort] = useState('added-desc')
  const [minRating, setMinRating] = useState(0)

  const items = useMemo(() => {
    const arr = Object.entries(watchlist).map(([id, w]) => ({
      id: Number(id),
      ...w,
      rating: getRating(seriesKey(Number(id))),
    }))
    let filtered = arr.filter((s) => s.rating >= minRating)
    switch (sort) {
      case 'added-asc':
        filtered.sort((a, b) => a.addedAt - b.addedAt)
        break
      case 'added-desc':
        filtered.sort((a, b) => b.addedAt - a.addedAt)
        break
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
    }
    return filtered
  }, [watchlist, sort, minRating, getRating, seriesKey])

  return (
    <div>
      <h1 className="page-title">Watchlist</h1>
      <div className="filter-row">
        <label htmlFor="sort">Sort</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="added-desc">Recently added</option>
          <option value="added-asc">Oldest added</option>
          <option value="rating-desc">Highest rated</option>
          <option value="title">Title (A→Z)</option>
        </select>
        <label htmlFor="minRating">Min rating</label>
        <select
          id="minRating"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        >
          <option value={0}>Any</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
          <option value={5}>5</option>
        </select>
        <span className="muted">{items.length} item{items.length === 1 ? '' : 's'}</span>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          Your watchlist is empty. Find a series and tap "+ Watchlist".
        </div>
      ) : (
        <div className="grid">
          {items.map((s) => (
            <article key={s.id} className="card">
              <Link to={`/series/${s.id}`}>
                {posterUrl(s.posterPath) ? (
                  <img
                    className="poster"
                    src={posterUrl(s.posterPath)}
                    alt={s.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="poster-placeholder">No poster</div>
                )}
                <div className="card-body">
                  <h3 className="card-title">{s.title}</h3>
                  <div className="card-meta">
                    {(s.firstAirDate || '').slice(0, 4) || '—'}
                    {s.rating > 0 && (
                      <>
                        {' · '}
                        <StarRating value={s.rating} />
                      </>
                    )}
                  </div>
                </div>
              </Link>
              <div style={{ padding: '0 12px 12px' }}>
                <button
                  className="btn"
                  onClick={() =>
                    toggleWatchlist({
                      id: s.id,
                      name: s.title,
                      poster_path: s.posterPath,
                      first_air_date: s.firstAirDate,
                    })
                  }
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
