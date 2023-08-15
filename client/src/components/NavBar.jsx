import React from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import MilkyWay from '../images/milkyWay.jpeg'
import { Link } from 'react-router-dom';
import "../styles/NavBar.css"

// create a navbar component with a button that navigates to the home page, to log out, to the profile page, and to switch to dark mode
const NavBar = (props) => {
  const { sessionId, setSessionId, navigateToProfile } = props

  const navigate = useNavigate()

  const navigateToDashboard = (sessionId) => {
    navigate("/dashboard/" + sessionId)
  }

  const logout = () => {
    Cookies.remove('sessionId')
    setSessionId("")
    navigate('/login')
  }




  return (
    <div>
      <nav className='navbar navbar-expand-xl p-4 fixed-top' style={{ backgroundImage: `url(${MilkyWay})` }}>
        <div className='container-fluid gap-3'>
          <button className='navbar-brand display-5 text-white' style={{fontSize: '3rem', backgroundColor: 'transparent', border: 'none' }} onClick={(e) => { navigateToDashboard(sessionId); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>UniVerse</button>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className='navbar-nav gap-5'>
              <li className='nav-item'>
                <button className='btn btn-outline-light' onClick={(e) => { navigateToDashboard(sessionId); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontWeight: 'bold' }}>Explore</button>
              </li>
              <li className='nav-item'>
                <Link to={`/profile/edit/${sessionId}`} className='btn btn-outline-light' style={{ fontWeight: 'bold' }}>Edit Profile</Link>
              </li>
              <li className='nav-item'>
                <button className=' btn btn-outline-danger' onClick={() => logout()} style={{ fontWeight: 'bold' }} >Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar