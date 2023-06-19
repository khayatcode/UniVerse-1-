import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';



const SideBarProfile = (props) => {
  const {userInfo, navigateToProfile, sessionId} = props
  const navigate = useNavigate()

  const editProfile = (e) => {
    e.preventDefault()
    navigate('/profile/edit/' + sessionId)
  }


  return (
    <div>
      <img src={userInfo.profile_pic} height={50} />
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">User Name: {userInfo.user_name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Location: {userInfo.location}</h6>
          <p className="card-text">Occupation: {userInfo.occupation}</p>
          <p className="card-text">Email: {userInfo.email}</p>
          {userInfo.id == sessionId ?
            <div>
              <button className="btn btn-primary" onClick={(e) => navigateToProfile(userInfo.id)}>View Profile</button>
              <button className="btn btn-primary" onClick={(e) => editProfile(e)}>Edit Profile</button>
              <a href="#" className="card-link">Log Out</a>
            </div>
          : null}
        </div>
      </div>
    </div>
  )
}

export default SideBarProfile