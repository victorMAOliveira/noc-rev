// TMDB API client
// Get a free key at https://www.themoviedb.org/settings/api

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'

export const posterUrl = (path, size = 'w342') =>
  path ? `${IMG}/${size}${path}` : null

export const stillUrl = (path, size = 'w300') =>
  path ? `${IMG}/${size}${path}` : null

async function get(path, params = {}) {
  if (!API_KEY) {
    throw new Error(
      'Missing TMDB API key. Copy .env.example to .env and add VITE_TMDB_API_KEY.',
    )
  }
  const url = new URL(BASE + path)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'en-US')
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  }
  const res = await fetch(url)
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`TMDB ${res.status}: ${txt || res.statusText}`)
  }
  return res.json()
}

export const tmdb = {
  trending: () => get('/trending/tv/week'),
  popular: (page = 1) => get('/tv/popular', { page }),
  topRated: (page = 1) => get('/tv/top_rated', { page }),
  search: (query, page = 1) => get('/search/tv', { query, page }),
  series: (id) => get(`/tv/${id}`),
  season: (id, seasonNumber) => get(`/tv/${id}/season/${seasonNumber}`),
  episode: (id, seasonNumber, episodeNumber) =>
    get(`/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`),
}

export const hasApiKey = () => Boolean(API_KEY)
