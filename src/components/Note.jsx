import { useRef } from 'react'
import Draggable from 'react-draggable'
import ReactMarkdown from 'react-markdown'

function Note({ id, note, onUpdatePosition, onDelete, onEdit, onBringToFront }) {
  const nodeRef = useRef(null)
  const colors = [
    '#FFF8B7',
    '#FF9BCB',
    '#90E4FF',
    '#D6FFB6',
    '#FFA36B',
    '#DBACFF',
    '#FF8A8C',
    '#C1FFE5',
  ]

  const sizes = [254, 254, 199, 254, 199, 254, 254, 199, 254, 199, 254, 199]

  const idHash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const color = colors[idHash % colors.length]
  const size = sizes[idHash % sizes.length]

  const rotations = [3, -2, 1, -3, 2, -1, 4, -2, 1, -3, 2, -1]
  const rotation = rotations[idHash % rotations.length]

  const noteStyle = {
    backgroundColor: color,
    transform: `rotate(${rotation}deg)`,
    width: `${size}px`,
    height: `${size}px`,
    zIndex: note.zIndex,
  }

  const handleDrag = (e, data) => {
    onUpdatePosition(id, data.x, data.y)
  }

  const handleStart = () => {
    onBringToFront(id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(id)
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(id)
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: note.x, y: note.y }}
      grid={[25, 25]}
      onDrag={handleDrag}
      onStart={handleStart}
    >
      <div ref={nodeRef} className="note" style={noteStyle}>
        <div className="note-controls">
          <button
            onClick={handleEdit}
            className="note-button edit-button"
            aria-label="Edit note"
            tabIndex={0}
          >
            ✎
          </button>
          <button
            onClick={handleDelete}
            className="note-button delete-button"
            aria-label="Delete note"
            tabIndex={0}
          >
            ✘
          </button>
        </div>
        {note.title && <h3 className="note-title">{note.title}</h3>}
        <div className="note-text">
          <ReactMarkdown>{note.text || ''}</ReactMarkdown>
        </div>
      </div>
    </Draggable>
  )
}

export default Note
