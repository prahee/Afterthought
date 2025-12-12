import { Navigate, Outlet, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

const MOODS = ['happy', 'sad', 'excited', 'calm', 'stressed', 'thoughtful']

function Layout() {
  const { user, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [allTags, setAllTags] = useState([])

  const isJournalDashboard = location.pathname === '/journal'

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleSearchChange = (e) => {
    const newParams = new URLSearchParams(searchParams)
    if (e.target.value) {
      newParams.set('search', e.target.value)
    }
    else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }

  const handleMoodChange = (e) => {
    const newParams = new URLSearchParams(searchParams)
    if (e.target.value) {
      newParams.set('mood', e.target.value)
    }
    else {
      newParams.delete('mood')
    }
    setSearchParams(newParams)
  }

  const handleTagChange = (e) => {
    const newParams = new URLSearchParams(searchParams)
    if (e.target.value) {
      newParams.set('tag', e.target.value)
    }
    else {
      newParams.delete('tag')
    }
    setSearchParams(newParams)
  }

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams)
    if (e.target.value) {
      newParams.set('sort', e.target.value)
    }
    else {
      newParams.delete('sort')
    }
    setSearchParams(newParams)
  }

  const handleNewEntry = () => {
    navigate('/journal/new')
  }

  return (
    <>
      <nav className={`navbar ${isJournalDashboard ? 'navbar-journal' : ''}`}>
        <div className="navbar-left">
          <span className="navbar-brand">AFTERTHOUGHT</span>
          <div className="navbar-links">
            <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Home
            </NavLink>
            <NavLink to="/journal" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Journal
            </NavLink>
          </div>
        </div>

        {isJournalDashboard && (
          <div className="navbar-journal-controls">
            <input
              type="text"
              placeholder="Search entries..."
              className="navbar-search-input"
              defaultValue={searchParams.get('search') || ''}
              onChange={handleSearchChange}
            />

            <select
              value={searchParams.get('sort') || 'newest'}
              onChange={handleSortChange}
              className="navbar-sort-filter"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="mood">Mood</option>
            </select>

            <select
              value={searchParams.get('mood') || ''}
              onChange={handleMoodChange}
              className="navbar-mood-filter"
            >
              <option value="">All Moods</option>
              {MOODS.map(mood => (
                <option key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>

            {allTags.length > 0 && (
              <select
                value={searchParams.get('tag') || ''}
                onChange={handleTagChange}
                className="navbar-tag-filter"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            )}

            <button onClick={handleNewEntry} className="navbar-new-entry-button">
              + New Entry
            </button>
          </div>
        )}

        <div className="navbar-right">
          <span className="user-info">{user.displayName}</span>
          <button onClick={signOut} className="signout-button">
            Sign Out
          </button>
        </div>
      </nav>
      <Outlet context={{ setAllTags }} />
    </>
  )
}

export default Layout
