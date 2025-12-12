import { useState, useEffect } from 'react'
import Note from './Note'
import CreateNote from './CreateNote'
import EditModal from './EditModal'
import { onNotesValueChange, createNote, updateNote, deleteNote } from '../services/datastore'
import { useAuth } from '../contexts/AuthContext'

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

function Home() {
  const { user } = useAuth()
  const [notes, setNotes] = useState({})
  const [maxZIndex, setMaxZIndex] = useState(1)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [actionHistory, setActionHistory] = useState([])

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

    onNotesValueChange(user.uid, (firebaseNotes) => {
      setNotes(firebaseNotes)

      const zIndexes = Object.values(firebaseNotes).map(note => note.zIndex || 0)
      const max = zIndexes.length > 0 ? Math.max(...zIndexes) : 0
      setMaxZIndex(max)
    })
  }, [user])

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

    createNote(user.uid, newNote)

    addToHistory({
      type: 'create',
      noteId: newNote.id,
      noteData: newNote,
    })

    setMaxZIndex(maxZIndex + 1)
  }

  const updateNotePosition = (id, x, y) => {
    const oldPosition = { x: notes[id].x, y: notes[id].y }
    updateNote(user.uid, id, { x, y })

    addToHistory({
      type: 'move',
      noteId: id,
      oldPosition,
      newPosition: { x, y },
    })
  }

  const handleDeleteNote = (id) => {
    const noteData = { ...notes[id] }
    deleteNote(user.uid, id)

    addToHistory({
      type: 'delete',
      noteId: id,
      noteData,
    })
  }

  const bringToFront = (id) => {
    const oldZIndex = notes[id].zIndex
    updateNote(user.uid, id, { zIndex: maxZIndex + 1 })

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

    updateNote(user.uid, editingNoteId, updatedFields)

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
        deleteNote(user.uid, lastAction.noteId)
        break

      case 'delete':
        createNote(user.uid, lastAction.noteData)
        break

      case 'edit':
        updateNote(user.uid, lastAction.noteId, lastAction.oldData)
        break

      case 'move':
        updateNote(user.uid, lastAction.noteId, lastAction.oldPosition)
        break

      case 'zindex':
        updateNote(user.uid, lastAction.noteId, { zIndex: lastAction.oldZIndex })
        break

      default:
        break
    }

    setActionHistory(prev => prev.slice(0, -1))
  }

  const sortedNotes = Object.entries(notes)

  return (
    <div className="app">
      <div className="undo-container">
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
        <h1>AFTERTHOUGHT</h1>
        <p>For thoughts you don't finish</p>
        <p>Until later.</p>
      </div>

      <CreateNote onAddNote={addNote} />

      {sortedNotes.map(([id, note]) => (
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
  )
}

export default Home
