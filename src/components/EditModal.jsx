import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function EditModal({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note.title || '')
  const [text, setText] = useState(note.text || '')
  const [showPreview, setShowPreview] = useState(false)

  const handleSave = () => {
    onSave({ title, text })
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-content" onClick={e => e.stopPropagation()} role="dialog">
        <div className="modal-header">
          <h2>Edit Note</h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            className="modal-input"
          />

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Content (supports markdown)"
            className="modal-textarea"
            rows="10"
          />

          <div className="modal-controls">
            <label className="preview-toggle">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={e => setShowPreview(e.target.checked)}
              />
              Show Preview
            </label>
          </div>

          {showPreview && (
            <div className="markdown-preview">
              <h4>Preview:</h4>
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleSave} className="save-button">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModal
