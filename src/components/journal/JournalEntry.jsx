import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../../contexts/AuthContext'
import { getJournalEntry, updateJournalEntry, deleteJournalEntry } from '../../services/datastore'

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

const MOODS = [
  { value: 'happy', label: 'Happy', color: '#FFD93D' },
  { value: 'sad', label: 'Sad', color: '#90E4FF' },
  { value: 'excited', label: 'Excited', color: '#FF9BCB' },
  { value: 'calm', label: 'Calm', color: '#D6FFB6' },
  { value: 'stressed', label: 'Stressed', color: '#FFA36B' },
  { value: 'thoughtful', label: 'Thoughtful', color: '#DBACFF' },
]

const MOOD_COLORS = {
  happy: '#FFD93D',
  sad: '#90E4FF',
  excited: '#FF9BCB',
  calm: '#D6FFB6',
  stressed: '#FFA36B',
  thoughtful: '#DBACFF',
}

function JournalEntry() {
  const { user } = useAuth()
  const { entryId } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editMood, setEditMood] = useState('')
  const [editTags, setEditTags] = useState('')
  const [editDate, setEditDate] = useState('')
  const [showPreview, setShowPreview] = useState(false)

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
    if (!user || !entryId) return

    getJournalEntry(user.uid, entryId, (fetchedEntry) => {
      if (fetchedEntry) {
        setEntry(fetchedEntry)
        setEditTitle(fetchedEntry.title || '')
        setEditContent(fetchedEntry.content || '')
        setEditMood(fetchedEntry.mood || '')
        setEditTags(fetchedEntry.tags ? fetchedEntry.tags.join(', ') : '')
        setEditDate(
          fetchedEntry.date
            ? new Date(fetchedEntry.date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        )
      }
    })
  }, [user, entryId])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Please enter both title and content')
      return
    }

    const updates = {
      title: editTitle.trim(),
      content: editContent.trim(),
      mood: editMood || null,
      tags: editTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      date: new Date(editDate).getTime(),
    }

    updateJournalEntry(user.uid, entryId, updates)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditTitle(entry.title || '')
    setEditContent(entry.content || '')
    setEditMood(entry.mood || '')
    setEditTags(entry.tags ? entry.tags.join(', ') : '')
    setEditDate(
      entry.date
        ? new Date(entry.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    )
    setIsEditing(false)
    setShowPreview(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      deleteJournalEntry(user.uid, entryId)
      navigate('/journal')
    }
  }

  const handleBackToDashboard = () => {
    navigate('/journal')
  }

  if (!entry) {
    return (
      <div className="app">
        <div className="loading">Loading entry...</div>
      </div>
    )
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="app journal-entry-view">
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

      <div className="entry-view-container">
        <div className="entry-view-header">
          <button onClick={handleBackToDashboard} className="back-button">
            ← Back to Journal
          </button>
          {!isEditing && (
            <div className="entry-actions">
              <button onClick={handleEdit} className="edit-entry-button">
                Edit
              </button>
              <button onClick={handleDelete} className="delete-entry-button">
                Delete
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="entry-view-content">
            <div className="entry-view-metadata">
              <span className="entry-view-date">{formatDate(entry.date || entry.createdAt)}</span>
              {entry.mood && (
                <div className="entry-view-mood">
                  <div
                    className="mood-indicator-large"
                    style={{ backgroundColor: MOOD_COLORS[entry.mood] }}
                  />
                  <span>{MOODS.find(m => m.value === entry.mood)?.label}</span>
                </div>
              )}
            </div>

            <h1 className="entry-view-title">{entry.title}</h1>

            {entry.tags && entry.tags.length > 0 && (
              <div className="entry-view-tags">
                {entry.tags.map((tag, index) => (
                  <span key={index} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="entry-view-text">
              <ReactMarkdown>{entry.content}</ReactMarkdown>
            </div>

            <div className="entry-view-footer">
              <small>
                Created:
                {' '}
                {new Date(entry.createdAt).toLocaleString()}
              </small>
              {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                <small>
                  Last updated:
                  {' '}
                  {new Date(entry.updatedAt).toLocaleString()}
                </small>
              )}
            </div>
          </div>
        ) : (
          <div className="editor-container">
            <div className="editor-header">
              <h2>Edit Entry</h2>
              <div className="editor-actions">
                <button onClick={() => setShowPreview(!showPreview)} className="preview-toggle">
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
                <button onClick={handleCancelEdit} className="cancel-button">
                  Cancel
                </button>
                <button onClick={handleSave} className="save-button">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="editor-form">
              {!showPreview
                ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        placeholder="Entry title..."
                        className="entry-title-input"
                      />

                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        placeholder="Write your thoughts... (Markdown supported)"
                        className="entry-content-textarea"
                      />

                      <div className="entry-metadata">
                        <div className="metadata-row">
                          <label>
                            Date:
                            <input
                              type="date"
                              value={editDate}
                              onChange={e => setEditDate(e.target.value)}
                              className="date-input"
                            />
                          </label>

                          <label>
                            Mood:
                            <select
                              value={editMood}
                              onChange={e => setEditMood(e.target.value)}
                              className="mood-select"
                            >
                              <option value="">Select a mood (optional)</option>
                              {MOODS.map(m => (
                                <option key={m.value} value={m.value}>
                                  {m.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <label className="tags-label">
                          Tags (comma-separated):
                          <input
                            type="text"
                            value={editTags}
                            onChange={e => setEditTags(e.target.value)}
                            placeholder="work, personal, ideas..."
                            className="tags-input"
                          />
                        </label>
                      </div>
                    </>
                  )
                : (
                    <div className="preview-pane">
                      <h1 className="preview-title">{editTitle || 'Untitled'}</h1>
                      <div className="preview-metadata">
                        {editDate && (
                          <span className="preview-date">
                            {new Date(editDate).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        {editMood && <span className="preview-mood">{MOODS.find(m => m.value === editMood)?.label}</span>}
                      </div>
                      <div className="preview-content">
                        <ReactMarkdown>{editContent || '*No content yet*'}</ReactMarkdown>
                      </div>
                      {editTags && (
                        <div className="preview-tags">
                          {editTags.split(',').map((tag, index) => (
                            <span key={index} className="tag-chip">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JournalEntry
