import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { onJournalEntriesChange } from '../../services/datastore'
import EntryCard from './EntryCard'

import img1 from '../../img/1.png'
import img2 from '../../img/2.png'
import img3 from '../../img/3.png'
import img4 from '../../img/4.png'
import img5 from '../../img/5.png'
import img6 from '../../img/6.png'
import img7 from '../../img/7.png'
import img8 from '../../img/8.png'
import img9 from '../../img/9.png'
import img10 from '../../img/10.png'

function JournalDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { setAllTags } = useOutletContext()
  const [entries, setEntries] = useState({})

  const searchQuery = searchParams.get('search') || ''
  const selectedMood = searchParams.get('mood') || ''
  const selectedTag = searchParams.get('tag') || ''
  const sortBy = searchParams.get('sort') || 'newest'

  const backgroundImages = [
    { src: img1, top: '15%', left: '8%', size: '140px' },
    { src: img2, top: '10%', right: '12%', size: '130px' },
    { src: img3, top: '65%', left: '5%', size: '135px' },
    { src: img4, top: '30%', right: '5%', size: '120px' },
    { src: img5, top: '50%', left: '85%', size: '125px' },
    { src: img6, top: '75%', right: '20%', size: '110px' },
    { src: img7, top: '20%', left: '45%', size: '150px' },
    { src: img8, top: '80%', left: '15%', size: '140px' },
    { src: img9, top: '45%', right: '30%', size: '130px' },
    { src: img10, top: '85%', right: '8%', size: '105px' },
    { src: img1, top: '5%', left: '25%', size: '115px' },
    { src: img2, top: '40%', left: '12%', size: '125px' },
    { src: img3, top: '25%', right: '25%', size: '120px' },
    { src: img4, top: '60%', right: '10%', size: '135px' },
    { src: img5, top: '90%', left: '40%', size: '110px' },
    { src: img6, top: '35%', left: '70%', size: '130px' },
    { src: img7, top: '55%', right: '45%', size: '125px' },
    { src: img8, top: '12%', left: '60%', size: '115px' },
    { src: img9, top: '70%', left: '30%', size: '120px' },
    { src: img10, top: '48%', left: '3%', size: '110px' },
    { src: img1, top: '33%', left: '38%', size: '125px' },
    { src: img2, top: '58%', right: '35%', size: '115px' },
    { src: img3, top: '8%', left: '78%', size: '120px' },
    { src: img4, top: '92%', left: '65%', size: '130px' },
    { src: img5, top: '22%', left: '18%', size: '110px' },
    { src: img6, top: '68%', right: '50%', size: '125px' },
    { src: img7, top: '42%', left: '55%', size: '135px' },
    { src: img8, top: '78%', right: '40%', size: '120px' },
    { src: img9, top: '28%', right: '15%', size: '115px' },
    { src: img10, top: '52%', left: '22%', size: '130px' },
    { src: img1, top: '95%', right: '25%', size: '110px' },
    { src: img2, top: '62%', left: '48%', size: '125px' },
    { src: img3, top: '18%', right: '55%', size: '120px' },
    { src: img4, top: '88%', left: '8%', size: '115px' },
    { src: img5, top: '38%', right: '22%', size: '130px' },
  ]

  useEffect(() => {
    if (!user) return

    onJournalEntriesChange(user.uid, (firebaseEntries) => {
      setEntries(firebaseEntries)
    })
  }, [user])

  useEffect(() => {
    const tagsSet = new Set()
    Object.values(entries).forEach((entry) => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    const tags = Array.from(tagsSet).sort()
    setAllTags(tags)
  }, [entries, setAllTags])

  const filteredEntries = useMemo(() => {
    let result = Object.entries(entries)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(([, entry]) =>
        entry.title.toLowerCase().includes(query)
        || entry.content.toLowerCase().includes(query),
      )
    }

    if (selectedMood) {
      result = result.filter(([, entry]) => entry.mood === selectedMood)
    }

    if (selectedTag) {
      result = result.filter(([, entry]) =>
        entry.tags && entry.tags.includes(selectedTag),
      )
    }

    result.sort(([, a], [, b]) => {
      const dateA = a.date || a.createdAt
      const dateB = b.date || b.createdAt

      switch (sortBy) {
        case 'oldest':
          return dateA - dateB
        case 'title':
          return a.title.localeCompare(b.title)
        case 'mood':
          return (a.mood || '').localeCompare(b.mood || '')
        case 'newest':
        default:
          return dateB - dateA
      }
    })

    return result
  }, [entries, searchQuery, selectedMood, selectedTag, sortBy])

  const groupedEntries = useMemo(() => {
    const groups = {}

    filteredEntries.forEach(([id, entry]) => {
      const date = new Date(entry.date || entry.createdAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      today.setHours(0, 0, 0, 0)
      yesterday.setHours(0, 0, 0, 0)
      const entryDate = new Date(date)
      entryDate.setHours(0, 0, 0, 0)

      let groupKey
      if (entryDate.getTime() === today.getTime()) {
        groupKey = 'Today'
      }
      else if (entryDate.getTime() === yesterday.getTime()) {
        groupKey = 'Yesterday'
      }
      else {
        groupKey = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push({ id, entry })
    })

    return groups
  }, [filteredEntries])

  const handleNewEntry = () => {
    navigate('/journal/new')
  }

  const handleClearFilters = () => {
    setSearchParams({})
  }

  const isEmpty = Object.keys(entries).length === 0
  const noResults = filteredEntries.length === 0 && !isEmpty

  return (
    <div className="app journal-dashboard">
        {backgroundImages.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt=""
            className="background-decoration"
            style={{
              top: img.top,
              left: img.left,
              right: img.right,
              width: img.size,
              height: img.size,
            }}
          />
        ))}

        {isEmpty
          ? (
              <div className="empty-state">
                <p>No journal entries yet.</p>
                <p>Start capturing your thoughts!</p>
                <button onClick={handleNewEntry} className="create-first-entry-button">
                  Create Your First Entry
                </button>
              </div>
            )
          : noResults
            ? (
                <div className="empty-state">
                  <p>No entries match your filters.</p>
                  <button
                    onClick={handleClearFilters}
                    className="clear-filters-button"
                  >
                    Clear Filters
                  </button>
                </div>
              )
            : (
                <div className="timeline">
                  {Object.entries(groupedEntries).map(([dateLabel, dateEntries]) => (
                    <div key={dateLabel} className="timeline-group">
                      <div className="timeline-date-label">{dateLabel}</div>
                      <div className="timeline-entries">
                        {dateEntries.map(({ id, entry }) => (
                          <EntryCard key={id} id={id} entry={entry} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
    </div>
  )
}

export default JournalDashboard
