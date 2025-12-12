import { useState } from 'react'

function CreateNote({ onAddNote }) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAddNote(title)
      setTitle('')
    }
  }

  return (
    <div className="create-note-container">
      <form onSubmit={handleSubmit} className="create-note-form">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
          className="note-input"
        />
        <button type="submit" className="create-button">
          + Add Note
        </button>
      </form>
      <p>⋆˙⟡ made with ᢉ𐭩 by rahee ⋆˚꩜｡</p>
    </div>
  )
}

export default CreateNote
