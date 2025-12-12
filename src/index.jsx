import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
import JournalDashboard from './components/journal/JournalDashboard'
import NewEntry from './components/journal/NewEntry'
import JournalEntry from './components/journal/JournalEntry'
import './style.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'journal',
        children: [
          {
            index: true,
            element: <JournalDashboard />,
          },
          {
            path: 'new',
            element: <NewEntry />,
          },
          {
            path: ':entryId',
            element: <JournalEntry />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
])

const root = createRoot(document.getElementById('main'))
root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
)
