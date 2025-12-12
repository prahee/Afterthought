import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../../contexts/AuthContext'
import { createJournalEntry } from '../../services/datastore'

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

function NewEntry() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [tags, setTags] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
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
    const interval = setInterval(() => {
      if (title || content) {
        localStorage.setItem(
          'journal-draft',
          JSON.stringify({ title, content, mood, tags, date }),
        )
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [title, content, mood, tags, date])

  useEffect(() => {
    const draft = localStorage.getItem('journal-draft')
    if (draft) {
      const parsed = JSON.parse(draft)
      setTitle(parsed.title || '')
      setContent(parsed.content || '')
      setMood(parsed.mood || '')
      setTags(parsed.tags || '')
      setDate(parsed.date || new Date().toISOString().split('T')[0])
    }
  }, [])

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter both title and content')
      return
    }

    const entry = {
      title: title.trim(),
      content: content.trim(),
      mood: mood || null,
      tags: tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      date: new Date(date).getTime(),
    }

    const entryId = createJournalEntry(user.uid, entry)

    localStorage.removeItem('journal-draft')

    navigate(`/journal/${entryId}`)
  }

  const handleCancel = () => {
    if (title || content) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        localStorage.removeItem('journal-draft')
        navigate('/journal')
      }
    }
    else {
      navigate('/journal')
    }
  }

  return (
    <div className="app journal-editor">
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

      <div className="editor-container">
        <div className="editor-header">
          <h2>New Journal Entry</h2>
          <div className="editor-actions">
            <button onClick={() => setShowPreview(!showPreview)} className="preview-toggle">
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button onClick={handleSave} className="save-button">
              Save Entry
            </button>
          </div>
        </div>

        <div className="editor-form">
          {!showPreview
            ? (
                <>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Entry title..."
                    className="entry-title-input"
                  />

                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Write your thoughts... (Markdown supported)"
                    className="entry-content-textarea"
                  />

                  <div className="entry-metadata">
                    <div className="metadata-row">
                      <label>
                        Date:
                        <input
                          type="date"
                          value={date}
                          onChange={e => setDate(e.target.value)}
                          className="date-input"
                        />
                      </label>

                      <label>
                        Mood:
                        <select
                          value={mood}
                          onChange={e => setMood(e.target.value)}
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
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        placeholder="work, personal, ideas..."
                        className="tags-input"
                      />
                    </label>
                  </div>
                </>
              )
            : (
                <div className="preview-pane">
                  <h1 className="preview-title">{title || 'Untitled'}</h1>
                  <div className="preview-metadata">
                    {date && (
                      <span className="preview-date">
                        {new Date(date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    {mood && <span className="preview-mood">{MOODS.find(m => m.value === mood)?.label}</span>}
                  </div>
                  <div className="preview-content">
                    <ReactMarkdown>{content || '*No content yet*'}</ReactMarkdown>
                  </div>
                  {tags && (
                    <div className="preview-tags">
                      {tags.split(',').map((tag, index) => (
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
    </div>
  )
}

export default NewEntry
