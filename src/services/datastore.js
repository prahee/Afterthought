import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, push, set, update, remove } from 'firebase/database'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'

// Firebase configuration is now loaded from environment variables.
// In Vite, these should be defined in your `.env` file with a `VITE_` prefix.
// See `.env.example` for the full list of required variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth(app)

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export function signOutUser() {
  return signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

export function onNotesValueChange(userId, callback) {
  const notesRef = ref(database, `users/${userId}/notes`)
  onValue(notesRef, (snapshot) => {
    const notes = snapshot.val()
    callback(notes || {})
  })
}

export function createNote(userId, note) {
  const notesRef = ref(database, `users/${userId}/notes`)
  const newNoteRef = push(notesRef)
  set(newNoteRef, note)
  return newNoteRef.key
}

export function updateNote(userId, id, updates) {
  const noteRef = ref(database, `users/${userId}/notes/${id}`)
  update(noteRef, updates)
}

export function deleteNote(userId, id) {
  const noteRef = ref(database, `users/${userId}/notes/${id}`)
  remove(noteRef)
}

export function onJournalEntriesChange(userId, callback) {
  const journalRef = ref(database, `users/${userId}/journal`)
  onValue(journalRef, (snapshot) => {
    const entries = snapshot.val()
    callback(entries || {})
  })
}

export function createJournalEntry(userId, entry) {
  const journalRef = ref(database, `users/${userId}/journal`)
  const newEntryRef = push(journalRef)
  const entryWithTimestamps = {
    ...entry,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  set(newEntryRef, entryWithTimestamps)
  return newEntryRef.key
}

export function updateJournalEntry(userId, entryId, updates) {
  const entryRef = ref(database, `users/${userId}/journal/${entryId}`)
  const updatesWithTimestamp = {
    ...updates,
    updatedAt: Date.now(),
  }
  update(entryRef, updatesWithTimestamp)
}

export function deleteJournalEntry(userId, entryId) {
  const entryRef = ref(database, `users/${userId}/journal/${entryId}`)
  remove(entryRef)
}

export function getJournalEntry(userId, entryId, callback) {
  const entryRef = ref(database, `users/${userId}/journal/${entryId}`)
  onValue(entryRef, (snapshot) => {
    const entry = snapshot.val()
    callback(entry)
  })
}
