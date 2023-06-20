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
      <nav className='navbar navbar-expand-xl p-4 fixed-top' style={{ backgroundColor: '#333333'}}>
        <div className='container d-flex justify-content-between'>
          <h1 className='navbar-brand display-1 text-white' style={{ fontSize: '38px', marginLeft: '1rem'}}>UniVerse</h1>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div >
            <ul className='navbar-nav gap-3 justify-content-evenly'>
              <li className='nav-item'>
                <button className='btn btn-outline-light' onClick={(e) => { navigateToDashboard(sessionId); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontWeight: 'bold' }}>Dashboard</button>              </li>
              <li className='nav-item'>
                <button className='btn btn-outline-light' onClick={(e) => navigateToProfile(sessionId)} style={{ fontWeight: 'bold' }} >Profile</button>
              </li>
              {/* <li className='nav-item'>
                <button className=' btn btn-outline-dark' onClick={() => navigate('/darkmode')} style={{ fontWeight: 'bold' }} >Dark Mode</button>
              </li> */}
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