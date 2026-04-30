import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { tmdb, stillUrl } from '../api/tmdb.js'
import { useUserData } from '../context/UserDataContext.jsx'
import StarRating from '../components/StarRating.jsx'
import ReviewForm from '../components/ReviewForm.jsx'

export default function EpisodeDetail() {
  const { id, seasonNumber, episodeNumber } = useParams()
  const seriesId = Number(id)
  const sNum = Number(seasonNumber)
  const eNum = Number(episodeNumber)

  const [episode, setEpisode] = useState(null)
  const [seriesName, setSeriesName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const {
    episodeKey,
    getRating,
    setRating,
    getReview,
    setReview,
    isEpisodeWatched,
    toggleEpisodeWatched,
    seriesIndex,
    rememberSeries,
  } = useUserData()

  const eKey = episodeKey(seriesId, sNum, eNum)
  const rating = getRating(eKey)
  const review = getReview(eKey)
  const watched = isEpisodeWatched(seriesId, sNum, eNum)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      tmdb.episode(seriesId, sNum, eNum),
      seriesIndex[seriesId]
        ? Promise.resolve(null)
        : tmdb.series(seriesId).catch(() => null),
    ])
      .then(([ep, ser]) => {
        if (cancelled) return
        setEpisode(ep)
        if (ser) {
          rememberSeries(ser)
          setSeriesName(ser.name)
        } else if (seriesIndex[seriesId]) {
          setSeriesName(seriesIndex[seriesId].title)
        }
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId, sNum, eNum])

  if (loading) return <div className="muted">Loading…</div>
  if (error) return <div className="error">{error}</div>
  if (!episode) return null

  const title =
    seriesName || seriesIndex[seriesId]?.title || `Series #${seriesId}`

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Link to={`/series/${seriesId}`}>← {title}</Link>
      </div>
      <h1 className="page-title">
        S{String(sNum).padStart(2, '0')}E
        {String(eNum).padStart(2, '0')} · {episode.name || `Episode ${eNum}`}
      </h1>
      <div className="meta muted" style={{ marginBottom: 12 }}>
        {episode.air_date || '—'}
        {episode.runtime ? ` · ${episode.runtime} min` : ''}
      </div>
      {stillUrl(episode.still_path, 'w780') && (
        <img
          src={stillUrl(episode.still_path, 'w780')}
          alt={episode.name}
          style={{
            width: '100%',
            maxWidth: 780,
            borderRadius: 6,
            marginBottom: 16,
          }}
        />
      )}
      {episode.overview && (
        <p style={{ maxWidth: 780, color: 'var(--text-dim)' }}>
          {episode.overview}
        </p>
      )}

      <div className="actions-row">
        <StarRating
          value={rating}
          onChange={(v) => setRating(eKey, v)}
          size="large"
        />
        <button
          className={'btn ' + (watched ? 'toggle-on' : '')}
          onClick={() => toggleEpisodeWatched(seriesId, sNum, eNum)}
        >
          {watched ? '✓ Watched' : 'Mark as watched'}
        </button>
      </div>

      <h2 className="section-title">Your review</h2>
      <ReviewForm
        value={review}
        placeholder={`What did you think of "${episode.name}"?`}
        onSave={(v) => setReview(eKey, v)}
      />
    </div>
  )
}
