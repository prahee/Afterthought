import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle } from '../services/datastore'
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

function Login() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate('/home')
    }
  }, [user, loading, navigate])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
      navigate('/home')
    }
    catch (error) {
      console.error('Error signing in:', error)
      alert('Failed to sign in. Please try again.')
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

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

  const decorativeNotes = [
    { color: '#FFF8B7', top: '20%', left: '15%', rotation: 3 },
    { color: '#FF9BCB', top: '60%', right: '10%', rotation: -2 },
    { color: '#90E4FF', top: '10%', right: '25%', rotation: 4 },
    { color: '#D6FFB6', top: '70%', left: '20%', rotation: -3 },
  ]

  return (
    <div className="login-container">
      {}
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

      {decorativeNotes.map((note, index) => (
        <div
          key={index}
          className="decorative-note"
          style={{
            backgroundColor: note.color,
            top: note.top,
            left: note.left,
            right: note.right,
            transform: `rotate(${note.rotation}deg)`,
          }}
        />
      ))}

      <div className="login-note">
        <div className="login-box">
          <h1>AFTERTHOUGHT</h1>
          <p>Sign in to start creating notes</p>
          <button onClick={handleSignIn} className="google-signin-button">
            <span className="google-icon">G</span>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
