import React from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie';

// create a navbar component with a button that navigates to the home page, to log out, to the profile page, and to switch to dark mode
const NavBar = (props) => {
  const {sessionId, setSessionId, navigateToProfile} = props

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
      <nav className='navbar navbar-expand-xl navbar-dark bg-dark p-3'>
        <div className='container-fluid'>
          <h1 className='navbar-brand display-1' style={{ fontSize: '24px' }}>UniVerse</h1>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <button className='nav-link btn btn-dark' onClick={(e) => navigateToDashboard(sessionId)}>Dashboard</button>
              </li>
              <li className='nav-item'>
                <button className='nav-link btn btn-dark' onClick={(e) => navigateToProfile(sessionId)}>Profile</button>
              </li>
              <li className='nav-item'>
                <button className='nav-link btn btn-dark' onClick={() => logout() }>Logout</button>
              </li>
              <li className='nav-item'>
                <button className='nav-link btn btn-dark' onClick={() => navigate('/darkmode')}>Dark Mode</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar