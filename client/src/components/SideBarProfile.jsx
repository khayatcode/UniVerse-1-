import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';



const SideBarProfile = (props) => {
  const { userInfo, navigateToProfile, sessionId } = props
  const navigate = useNavigate()

  const editProfile = (e) => {
    e.preventDefault()
    navigate('/profile/edit/' + sessionId)
  }


  return (
    <div className='d-flex align-items-center mb-3'>
      <div className="card" style={{ width: '400px' }}>
        <div className="card-body" style={{backgroundColor: "#f2f2f2"}}>
          <img src={userInfo.profile_pic} height={100} width={100} className='rounded-circle' style={{ borderRadius: '50%' }} />
          <hr />
          <div className="d-flex align-items-center justify-content-evenly">
            <h6 className="card-title me-3">User Name:</h6>
            <p className="card-text mb-1 ">{userInfo.user_name}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-evenly">
            <h6 className="card-subtitle me-3 ">Location:</h6>
            <p className="card-text mb-1">{userInfo.location}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-evenly">
            <h6 className="card-subtitle me-3">Occupation:</h6>
            <p className="card-text mb-1">{userInfo.occupation}</p>
          </div>
          
          {userInfo.id == sessionId ?
          <div>
            <hr />
            <div>
              {/* <button className="btn btn-primary me-2" onClick={(e) => navigateToProfile(userInfo.id)}>View Profile</button> */}
              <button className="btn text-white me-2" onClick={(e) => editProfile(e)} style={{ fontWeight: 'bold', backgroundColor: "#483D8B" }} >Edit Profile</button>
            </div>
          </div>
            : null}
        </div>
      </div>
    </div>
  )
}

export default SideBarProfile