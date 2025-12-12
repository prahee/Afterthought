import { useNavigate } from 'react-router-dom'

const MOOD_COLORS = {
  happy: '#FFD93D',
  sad: '#90E4FF',
  excited: '#FF9BCB',
  calm: '#D6FFB6',
  stressed: '#FFA36B',
  thoughtful: '#DBACFF',
}

function EntryCard({ id, entry }) {
  const navigate = useNavigate()

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    today.setHours(0, 0, 0, 0)
    yesterday.setHours(0, 0, 0, 0)
    const entryDate = new Date(date)
    entryDate.setHours(0, 0, 0, 0)

    if (entryDate.getTime() === today.getTime()) {
      return 'Today'
    }
    else if (entryDate.getTime() === yesterday.getTime()) {
      return 'Yesterday'
    }
    else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }
  }

  const getPreview = (content) => {
    const plainText = content
      .replace(/[#*_~`]/g, '')
      .replace(/\n/g, ' ')
      .trim()
    return plainText.length > 100 ? `${plainText.substring(0, 100)}...` : plainText
  }

  const handleClick = () => {
    navigate(`/journal/${id}`)
  }

  return (
    <div className="entry-card" onClick={handleClick}>
      <div className="entry-card-header">
        <span className="entry-date">{formatDate(entry.date || entry.createdAt)}</span>
        {entry.mood && (
          <div
            className="mood-indicator"
            style={{ backgroundColor: MOOD_COLORS[entry.mood] }}
            title={entry.mood}
          />
        )}
      </div>
      <h3 className="entry-title">{entry.title}</h3>
      <p className="entry-preview">{getPreview(entry.content)}</p>
      {entry.tags && entry.tags.length > 0 && (
        <div className="entry-tags">
          {entry.tags.map((tag, index) => (
            <span key={index} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default EntryCard
