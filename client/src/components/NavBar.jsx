import React from 'react'
import {useNavigate} from 'react-router-dom'

// create a navbar component with a button that navigates to the home page, to log out, to the profile page, and to switch to dark mode
const NavBar = () => {

  const navigate = useNavigate()

  // const darkMode = () => {
  //   fetch('http://127.0.0.1:5000/darkmode', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     credentials: 'include'
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('data in darkmode', data)
  //     if (data.success) {
  //       navigate('/darkmode')
  //     }
  //   })
  //   .catch(err => {
  //     console.log(err),
  //     console.log('Network error')
  //   })
  // }

  

  const logout = () => {
    fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      console.log('data in logout', data)
      if (data.success) {
        navigate('/')
      }
    })
    .catch(err => {
      console.log(err)
      console.log('Network error')
    })
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
                <button className='nav-link btn btn-dark' onClick={() => navigate('/')}>Home</button>
              </li>
              <li className='nav-item'>
                <button className='nav-link btn btn-dark' onClick={() => navigate('/profile')}>Profile</button>
              </li>
              <li className='nav-item'>
                <button className='nav-link btn btn-dark' onClick={logout}>Log Out</button>
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