import React from 'react'
import { useEffect, useState } from 'react'


const SideBarProfile = (props) => {
  const {userInfo} = props

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">User Name: {userInfo.user_name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Location: {userInfo.location}</h6>
          <p className="card-text">Occupation: {userInfo.occupation}</p>
          <p className="card-text">Email: {userInfo.email}</p>
          <a href="#" className="card-link">View Profile</a>
          <a href="#" className="card-link">Edit Profile</a>
          <a href="#" className="card-link">Log Out</a>
        </div>
    </div>
    </div>
  )
}

export default SideBarProfile