import { Link } from 'react-router-dom'
import StarRating from './StarRating.jsx'
import { useUserData } from '../context/UserDataContext.jsx'

export default function EpisodeRow({ seriesId, episode }) {
  const {
    getRating,
    episodeKey,
    isEpisodeWatched,
    toggleEpisodeWatched,
  } = useUserData()

  const watched = isEpisodeWatched(
    seriesId,
    episode.season_number,
    episode.episode_number,
  )
  const rating = getRating(
    episodeKey(seriesId, episode.season_number, episode.episode_number),
  )

  return (
    <div className="episode-row">
      <span className="episode-num">
        S{String(episode.season_number).padStart(2, '0')}E
        {String(episode.episode_number).padStart(2, '0')}
      </span>
      <div>
        <Link
          className="episode-title"
          to={`/series/${seriesId}/season/${episode.season_number}/episode/${episode.episode_number}`}
        >
          {episode.name || `Episode ${episode.episode_number}`}
        </Link>
        {rating > 0 && (
          <span style={{ marginLeft: 8 }}>
            <StarRating value={rating} />
          </span>
        )}
      </div>
      <span className="episode-air">{episode.air_date || ''}</span>
      <button
        className={'btn ' + (watched ? 'toggle-on' : '')}
        onClick={() =>
          toggleEpisodeWatched(
            seriesId,
            episode.season_number,
            episode.episode_number,
          )
        }
        title={watched ? 'Mark as unwatched' : 'Mark as watched'}
      >
        {watched ? '✓ Watched' : 'Mark watched'}
      </button>
    </div>
  )
}
