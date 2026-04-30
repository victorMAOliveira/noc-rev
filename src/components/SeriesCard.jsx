import { Link } from 'react-router-dom'
import { posterUrl } from '../api/tmdb.js'
import { useUserData } from '../context/UserDataContext.jsx'
import StarRating from './StarRating.jsx'

export default function SeriesCard({ series }) {
  const { getRating, seriesKey } = useUserData()
  const rating = getRating(seriesKey(series.id))
  const year = (series.first_air_date || '').slice(0, 4)
  const url = posterUrl(series.poster_path)

  return (
    <article className="card">
      <Link to={`/series/${series.id}`}>
        {url ? (
          <img className="poster" src={url} alt={series.name} loading="lazy" />
        ) : (
          <div className="poster-placeholder">No poster</div>
        )}
        <div className="card-body">
          <h3 className="card-title">{series.name}</h3>
          <div className="card-meta">
            {year || '—'}
            {rating > 0 && (
              <>
                {' · '}
                <StarRating value={rating} />
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
