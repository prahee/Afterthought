import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Note from './Note'
import CreateNote from './CreateNote'
import EditModal from './EditModal'
import { onNotesValueChange, createNote, updateNote, deleteNote, signOutUser } from '../services/datastore'

import img1 from '../img/1.png'
import img2 from '../img/2.png'
import img3 from '../img/3.png'
import img4 from '../img/4.png'
import img5 from '../img/5.png'
import img6 from '../img/6.png'
import img7 from '../img/7.png'
import img8 from '../img/8.png'
import img9 from '../img/9.png'
import img10 from '../img/10.png'

function Board({ user }) {
  const { boardId } = useParams()
  const [notes, setNotes] = useState({})
  const [maxZIndex, setMaxZIndex] = useState(1)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [actionHistory, setActionHistory] = useState([])

  const backgroundImages = [
    { src: img1, top: '15%', left: '8%', size: '100px' },
    { src: img2, top: '10%', right: '12%', size: '90px' },
    { src: img3, top: '65%', left: '5%', size: '95px' },
    { src: img4, top: '30%', right: '5%', size: '80px' },
    { src: img5, top: '50%', left: '85%', size: '85px' },
    { src: img6, top: '75%', right: '20%', size: '70px' },
    { src: img7, top: '20%', left: '45%', size: '110px' },
    { src: img8, top: '80%', left: '15%', size: '100px' },
    { src: img9, top: '45%', right: '30%', size: '90px' },
    { src: img10, top: '85%', right: '8%', size: '65px' },
  ]

  useEffect(() => {
    if (!user || !boardId) return

    onNotesValueChange(user.uid, boardId, (firebaseNotes) => {
      setNotes(firebaseNotes)

      const zIndexes = Object.values(firebaseNotes).map(note => note.zIndex || 0)
      const max = zIndexes.length > 0 ? Math.max(...zIndexes) : 0
      setMaxZIndex(max)
    })
  }, [user, boardId])

  const addToHistory = (action) => {
    setActionHistory(prev => [...prev.slice(-9), action])
  }

  const addNote = (title) => {
    const newNote = {
      title,
      text: 'Write down your text',
      x: 100 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      zIndex: maxZIndex + 1,
    }

    createNote(user.uid, boardId, newNote)

    addToHistory({
      type: 'create',
      noteId: newNote.id,
      noteData: newNote,
    })

    setMaxZIndex(maxZIndex + 1)
  }

  const updateNotePosition = (id, x, y) => {
    const oldPosition = { x: notes[id].x, y: notes[id].y }
    updateNote(user.uid, boardId, id, { x, y })

    addToHistory({
      type: 'move',
      noteId: id,
      oldPosition,
      newPosition: { x, y },
    })
  }

  const handleDeleteNote = (id) => {
    const noteData = { ...notes[id] }
    deleteNote(user.uid, boardId, id)

    addToHistory({
      type: 'delete',
      noteId: id,
      noteData,
    })
  }

  const bringToFront = (id) => {
    const oldZIndex = notes[id].zIndex
    updateNote(user.uid, boardId, id, { zIndex: maxZIndex + 1 })

    addToHistory({
      type: 'zindex',
      noteId: id,
      oldZIndex,
      newZIndex: maxZIndex + 1,
    })

    setMaxZIndex(maxZIndex + 1)
  }

  const openEditModal = (id) => {
    setEditingNoteId(id)
  }

  const closeEditModal = () => {
    setEditingNoteId(null)
  }

  const saveNote = (updatedFields) => {
    const oldData = {
      title: notes[editingNoteId].title,
      text: notes[editingNoteId].text,
    }

    updateNote(user.uid, boardId, editingNoteId, updatedFields)

    addToHistory({
      type: 'edit',
      noteId: editingNoteId,
      oldData,
      newData: updatedFields,
    })

    closeEditModal()
  }

  const handleUndo = () => {
    if (actionHistory.length === 0) return

    const lastAction = actionHistory[actionHistory.length - 1]

    switch (lastAction.type) {
      case 'create':
        deleteNote(user.uid, boardId, lastAction.noteId)
        break

      case 'delete':
        createNote(user.uid, boardId, lastAction.noteData)
        break

      case 'edit':
        updateNote(user.uid, boardId, lastAction.noteId, lastAction.oldData)
        break

      case 'move':
        updateNote(user.uid, boardId, lastAction.noteId, lastAction.oldPosition)
        break

      case 'zindex':
        updateNote(user.uid, boardId, lastAction.noteId, { zIndex: lastAction.oldZIndex })
        break

      default:
        break
    }

    setActionHistory(prev => prev.slice(0, -1))
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
    }
    catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button
            onClick={handleUndo}
            className="undo-button"
            disabled={actionHistory.length === 0}
            aria-label="Undo last action"
          >
            ↶ Undo
            {' '}
            {actionHistory.length > 0 && `(${actionHistory.length})`}
          </button>
        </div>
        <div className="navbar-right">
          <span className="user-info">{user.displayName}</span>
          <button onClick={handleSignOut} className="signout-button">
            Sign Out
          </button>
        </div>
      </nav>
      <div className="app">
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

        <div className="hero-text">
          <h1>STICK</h1>
          <h1>WITH</h1>
          <h1>IT</h1>
          <p>STICK IT. SHARE IT.</p>
          <p>MAKE IT HAPPEN.</p>
        </div>

        <CreateNote onAddNote={addNote} />

        {Object.entries(notes).map(([id, note]) => (
          <Note
            key={id}
            id={id}
            note={note}
            onUpdatePosition={updateNotePosition}
            onDelete={handleDeleteNote}
            onEdit={openEditModal}
            onBringToFront={bringToFront}
          />
        ))}

        {editingNoteId !== null && notes[editingNoteId] && (
          <EditModal
            note={notes[editingNoteId]}
            onSave={saveNote}
            onClose={closeEditModal}
          />
        )}
      </div>
    </>
  )
}

export default Board
