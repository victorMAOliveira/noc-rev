// Tiny localStorage wrapper, namespaced under "nocrev:"

const PREFIX = 'nocrev:'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* quota or unavailable — ignore */
  }
}

// Stable IDs for ratings/reviews
export const seriesKey = (seriesId) => `s${seriesId}`
export const episodeKey = (seriesId, seasonNumber, episodeNumber) =>
  `s${seriesId}_se${seasonNumber}_ep${episodeNumber}`
