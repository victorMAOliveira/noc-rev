import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          Noc<span className="brand-accent">Rev</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/watchlist">Watchlist</NavLink>
          <NavLink to="/watched">Watched</NavLink>
        </div>
        <form className="search-bar" onSubmit={onSubmit}>
          <input
            type="search"
            placeholder="Search series..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </nav>
  )
}
