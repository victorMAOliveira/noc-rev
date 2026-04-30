import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save, seriesKey, episodeKey } from '../utils/storage.js'

/**
 * Shape of user data:
 *  ratings: { [key]: number }              0.5 .. 5  in 0.5 increments
 *  reviews: { [key]: string }
 *  watchlist: { [seriesId]: { addedAt, title, posterPath } }
 *  watchedEpisodes: { [episodeKey]: { watchedAt, seriesId, seasonNumber, episodeNumber } }
 *  seriesIndex: { [seriesId]: { title, posterPath } }   // cache for list views
 */

const UserDataContext = createContext(null)

export function UserDataProvider({ children }) {
  const [ratings, setRatings] = useState(() => load('ratings', {}))
  const [reviews, setReviews] = useState(() => load('reviews', {}))
  const [watchlist, setWatchlist] = useState(() => load('watchlist', {}))
  const [watchedEpisodes, setWatchedEpisodes] = useState(() =>
    load('watchedEpisodes', {}),
  )
  const [seriesIndex, setSeriesIndex] = useState(() => load('seriesIndex', {}))

  useEffect(() => save('ratings', ratings), [ratings])
  useEffect(() => save('reviews', reviews), [reviews])
  useEffect(() => save('watchlist', watchlist), [watchlist])
  useEffect(() => save('watchedEpisodes', watchedEpisodes), [watchedEpisodes])
  useEffect(() => save('seriesIndex', seriesIndex), [seriesIndex])

  const api = useMemo(() => {
    const getRating = (key) => ratings[key] ?? 0
    const setRating = (key, value) =>
      setRatings((prev) => {
        const next = { ...prev }
        if (!value) delete next[key]
        else next[key] = value
        return next
      })

    const getReview = (key) => reviews[key] ?? ''
    const setReview = (key, value) =>
      setReviews((prev) => {
        const next = { ...prev }
        if (!value) delete next[key]
        else next[key] = value
        return next
      })

    const rememberSeries = (series) => {
      if (!series?.id) return
      setSeriesIndex((prev) => ({
        ...prev,
        [series.id]: {
          title: series.name || series.original_name || `#${series.id}`,
          posterPath: series.poster_path || null,
          firstAirDate: series.first_air_date || null,
        },
      }))
    }

    const isOnWatchlist = (seriesId) => Boolean(watchlist[seriesId])
    const toggleWatchlist = (series) => {
      setWatchlist((prev) => {
        const next = { ...prev }
        if (next[series.id]) {
          delete next[series.id]
        } else {
          next[series.id] = {
            addedAt: Date.now(),
            title: series.name,
            posterPath: series.poster_path || null,
            firstAirDate: series.first_air_date || null,
          }
        }
        return next
      })
    }

    const isEpisodeWatched = (seriesId, seasonNumber, episodeNumber) =>
      Boolean(watchedEpisodes[episodeKey(seriesId, seasonNumber, episodeNumber)])

    const setEpisodeWatched = (
      seriesId,
      seasonNumber,
      episodeNumber,
      watched,
    ) => {
      setWatchedEpisodes((prev) => {
        const k = episodeKey(seriesId, seasonNumber, episodeNumber)
        const next = { ...prev }
        if (watched) {
          next[k] = {
            watchedAt: Date.now(),
            seriesId,
            seasonNumber,
            episodeNumber,
          }
        } else {
          delete next[k]
        }
        return next
      })
    }

    const toggleEpisodeWatched = (seriesId, seasonNumber, episodeNumber) => {
      const watched = isEpisodeWatched(seriesId, seasonNumber, episodeNumber)
      setEpisodeWatched(seriesId, seasonNumber, episodeNumber, !watched)
    }

    const watchedEpisodeCountForSeries = (seriesId) =>
      Object.values(watchedEpisodes).filter((e) => e.seriesId === seriesId)
        .length

    return {
      ratings,
      reviews,
      watchlist,
      watchedEpisodes,
      seriesIndex,
      // helpers
      seriesKey,
      episodeKey,
      getRating,
      setRating,
      getReview,
      setReview,
      isOnWatchlist,
      toggleWatchlist,
      isEpisodeWatched,
      toggleEpisodeWatched,
      setEpisodeWatched,
      watchedEpisodeCountForSeries,
      rememberSeries,
    }
  }, [ratings, reviews, watchlist, watchedEpisodes, seriesIndex])

  return (
    <UserDataContext.Provider value={api}>{children}</UserDataContext.Provider>
  )
}

export function useUserData() {
  const ctx = useContext(UserDataContext)
  if (!ctx) throw new Error('useUserData must be used within UserDataProvider')
  return ctx
}
