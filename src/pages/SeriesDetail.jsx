import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { tmdb, posterUrl } from '../api/tmdb.js'
import { useUserData } from '../context/UserDataContext.jsx'
import StarRating from '../components/StarRating.jsx'
import ReviewForm from '../components/ReviewForm.jsx'
import EpisodeRow from '../components/EpisodeRow.jsx'

export default function SeriesDetail() {
  const { id } = useParams()
  const seriesId = Number(id)
  const [series, setSeries] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openSeason, setOpenSeason] = useState(null)
  const [seasonCache, setSeasonCache] = useState({}) // seasonNumber -> data

  const {
    seriesKey,
    getRating,
    setRating,
    getReview,
    setReview,
    isOnWatchlist,
    toggleWatchlist,
    rememberSeries,
    watchedEpisodeCountForSeries,
  } = useUserData()

  const sKey = seriesKey(seriesId)
  const rating = getRating(sKey)
  const review = getReview(sKey)
  const onWatchlist = isOnWatchlist(seriesId)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    tmdb
      .series(seriesId)
      .then((data) => {
        if (cancelled) return
        setSeries(data)
        rememberSeries(data)
        // auto-open the first non-empty season
        const firstSeason = (data.seasons || []).find(
          (s) => s.episode_count > 0 && s.season_number > 0,
        )
        if (firstSeason) setOpenSeason(firstSeason.season_number)
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId])

  useEffect(() => {
    if (openSeason == null) return
    if (seasonCache[openSeason]) return
    let cancelled = false
    tmdb
      .season(seriesId, openSeason)
      .then(
        (data) =>
          !cancelled &&
          setSeasonCache((prev) => ({ ...prev, [openSeason]: data })),
      )
      .catch((e) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [seriesId, openSeason, seasonCache])

  const seasons = useMemo(
    () => (series?.seasons || []).filter((s) => s.season_number >= 0),
    [series],
  )
  const watchedCount = watchedEpisodeCountForSeries(seriesId)
  const totalEps = series?.number_of_episodes || 0

  if (loading) return <div className="muted">Loading…</div>
  if (error) return <div className="error">{error}</div>
  if (!series) return null

  return (
    <div>
      <div className="series-hero">
        {posterUrl(series.poster_path, 'w342') ? (
          <img
            className="poster"
            src={posterUrl(series.poster_path, 'w342')}
            alt={series.name}
          />
        ) : (
          <div className="poster-placeholder" style={{ width: 200 }}>
            No poster
          </div>
        )}
        <div>
          <h1>{series.name}</h1>
          <div className="meta">
            {(series.first_air_date || '').slice(0, 4)}
            {series.number_of_seasons
              ? ` · ${series.number_of_seasons} season${series.number_of_seasons > 1 ? 's' : ''}`
              : ''}
            {totalEps ? ` · ${totalEps} episodes` : ''}
            {totalEps ? ` · ${watchedCount}/${totalEps} watched` : ''}
          </div>
          {series.genres?.length > 0 && (
            <div className="tag-row">
              {series.genres.map((g) => (
                <span className="tag" key={g.id}>
                  {g.name}
                </span>
              ))}
            </div>
          )}
          <p className="overview">{series.overview}</p>
          <div className="actions-row">
            <StarRating
              value={rating}
              onChange={(v) => setRating(sKey, v)}
              size="large"
            />
            <button
              className={'btn ' + (onWatchlist ? 'toggle-on' : '')}
              onClick={() => toggleWatchlist(series)}
            >
              {onWatchlist ? '✓ On watchlist' : '+ Watchlist'}
            </button>
          </div>
        </div>
      </div>

      <h2 className="section-title">Your review</h2>
      <ReviewForm
        value={review}
        placeholder={`What did you think of ${series.name}?`}
        onSave={(v) => setReview(sKey, v)}
      />

      <h2 className="section-title">Seasons</h2>
      {seasons.length === 0 && (
        <div className="empty-state">No season data available.</div>
      )}
      {seasons.map((s) => (
        <SeasonBlock
          key={s.id}
          seriesId={seriesId}
          season={s}
          open={openSeason === s.season_number}
          onToggle={() =>
            setOpenSeason(
              openSeason === s.season_number ? null : s.season_number,
            )
          }
          data={seasonCache[s.season_number]}
        />
      ))}
    </div>
  )
}

function SeasonBlock({ seriesId, season, open, onToggle, data }) {
  return (
    <div className="season-section">
      <button className="season-toggle" onClick={onToggle}>
        <span>
          {season.name || `Season ${season.season_number}`}
          {season.episode_count
            ? ` · ${season.episode_count} episodes`
            : ''}
          {season.air_date ? ` · ${season.air_date.slice(0, 4)}` : ''}
        </span>
        <span>{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="episode-list">
          {!data && <div className="muted">Loading episodes…</div>}
          {data?.episodes?.map((ep) => (
            <EpisodeRow key={ep.id} seriesId={seriesId} episode={ep} />
          ))}
        </div>
      )}
    </div>
  )
}
