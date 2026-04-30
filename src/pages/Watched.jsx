import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserData } from '../context/UserDataContext.jsx'
import StarRating from '../components/StarRating.jsx'

export default function Watched() {
  const { watchedEpisodes, ratings, episodeKey, seriesIndex } = useUserData()
  const [sort, setSort] = useState('watched-desc')
  const [minRating, setMinRating] = useState(0)
  const [groupBySeries, setGroupBySeries] = useState(true)

  const items = useMemo(() => {
    const arr = Object.values(watchedEpisodes).map((e) => {
      const k = episodeKey(e.seriesId, e.seasonNumber, e.episodeNumber)
      return {
        ...e,
        rating: ratings[k] ?? 0,
        key: k,
        seriesTitle: seriesIndex[e.seriesId]?.title || `Series #${e.seriesId}`,
      }
    })
    let filtered = arr.filter((e) => e.rating >= minRating)
    switch (sort) {
      case 'watched-desc':
        filtered.sort((a, b) => b.watchedAt - a.watchedAt)
        break
      case 'watched-asc':
        filtered.sort((a, b) => a.watchedAt - b.watchedAt)
        break
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
    }
    return filtered
  }, [watchedEpisodes, ratings, minRating, sort, episodeKey, seriesIndex])

  const grouped = useMemo(() => {
    if (!groupBySeries) return null
    const out = new Map()
    for (const it of items) {
      if (!out.has(it.seriesId))
        out.set(it.seriesId, { title: it.seriesTitle, episodes: [] })
      out.get(it.seriesId).episodes.push(it)
    }
    // sort episodes within group by season/episode ascending
    for (const g of out.values()) {
      g.episodes.sort(
        (a, b) =>
          a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber,
      )
    }
    return out
  }, [groupBySeries, items])

  return (
    <div>
      <h1 className="page-title">Watched episodes</h1>
      <div className="filter-row">
        <label htmlFor="sort">Sort</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          disabled={groupBySeries}
        >
          <option value="watched-desc">Recently watched</option>
          <option value="watched-asc">Oldest watched</option>
          <option value="rating-desc">Highest rated</option>
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
        <label>
          <input
            type="checkbox"
            checked={groupBySeries}
            onChange={(e) => setGroupBySeries(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Group by series
        </label>
        <span className="muted">
          {items.length} episode{items.length === 1 ? '' : 's'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          You haven't logged any episodes yet. Open a series and mark some
          episodes as watched.
        </div>
      ) : groupBySeries ? (
        Array.from(grouped.entries()).map(([sid, g]) => (
          <div key={sid} style={{ marginBottom: 24 }}>
            <h2 className="section-title">
              <Link to={`/series/${sid}`}>{g.title}</Link>{' '}
              <span className="muted" style={{ textTransform: 'none' }}>
                · {g.episodes.length} episode{g.episodes.length === 1 ? '' : 's'}
              </span>
            </h2>
            <div className="episode-list">
              {g.episodes.map((e) => (
                <div className="episode-row" key={e.key}>
                  <span className="episode-num">
                    S{String(e.seasonNumber).padStart(2, '0')}E
                    {String(e.episodeNumber).padStart(2, '0')}
                  </span>
                  <Link
                    to={`/series/${e.seriesId}/season/${e.seasonNumber}/episode/${e.episodeNumber}`}
                  >
                    Episode {e.episodeNumber}
                  </Link>
                  <span className="episode-air">
                    {new Date(e.watchedAt).toLocaleDateString()}
                  </span>
                  {e.rating > 0 ? (
                    <StarRating value={e.rating} />
                  ) : (
                    <span className="muted">—</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="episode-list">
          {items.map((e) => (
            <div className="episode-row" key={e.key}>
              <span className="episode-num">
                S{String(e.seasonNumber).padStart(2, '0')}E
                {String(e.episodeNumber).padStart(2, '0')}
              </span>
              <div>
                <Link
                  to={`/series/${e.seriesId}/season/${e.seasonNumber}/episode/${e.episodeNumber}`}
                >
                  {e.seriesTitle} — Ep {e.episodeNumber}
                </Link>
              </div>
              <span className="episode-air">
                {new Date(e.watchedAt).toLocaleDateString()}
              </span>
              {e.rating > 0 ? (
                <StarRating value={e.rating} />
              ) : (
                <span className="muted">—</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
