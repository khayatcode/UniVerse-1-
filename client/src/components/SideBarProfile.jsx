import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/SideBarProfile.css'



const SideBarProfile = (props) => {
  const { userInfo, navigateToProfile, sessionId, numberOfFollowers, numberOfFollows, numberOfPosts, isInProfile } = props
  const navigate = useNavigate()

  const editProfile = (e) => {
    e.preventDefault()
    navigate('/profile/edit/' + sessionId)
  }


  return (
    <div className='d-flex align-items-center'>
      <div className="card " style={{width: "100%", backgroundColor: "#f2f2f2"}}>
        <div className="card-body rounded">
          <img className='sideBarPic' src={userInfo.profile_pic}/>
          <hr />
          <div className="d-flex align-items-center gap-3 overflow-auto">
            <h6 className="card-subtitle cardFont" style={{marginLeft: "10%"}}><strong>Username:</strong></h6>
            <p className="card-text mb-1 cardFont2">{userInfo.user_name}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center gap-3 overflow-auto">
            <h6 className="card-subtitle cardFont" style={{marginLeft: "10%"}} ><strong>Occupation:</strong></h6>
            <p className="card-text mb-1 cardFont2">{userInfo.occupation}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center gap-3 overflow-auto">
            <h6 className="card-subtitle cardFont" style={{marginLeft: "10%"}}><strong>Followers:</strong></h6>
            <p className="card-text mb-1 cardFont2">{numberOfFollowers}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center gap-3 overflow-auto">
            <h6 className="card-subtitle cardFont" style={{marginLeft: "10%"}}><strong>Following:</strong></h6>
            <p className="card-text mb-1 cardFont2">{numberOfFollows}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center gap-3 overflow-auto">
            <h6 className="card-subtitle cardFont" style={{marginLeft: "10%"}}><strong>Posts:</strong></h6>
            <p className="card-text mb-1 cardFont2">{numberOfPosts}</p>
          </div>
          {isInProfile ?
              <div>
                <hr />
                <div>
                  <Link to={`/dashboard/${sessionId}`} className="btn text-white sideBarBtn" style={{fontWeight: 'bold', backgroundColor: "#483D8B"}}>Explore</Link>
                </div>
              </div>
            : 
            userInfo.id == sessionId ?
              <div>
                <hr />
                <div>
                  <button className="btn text-white sideBarBtn" style={{fontWeight: 'bold', backgroundColor: "#483D8B"}} onClick={(e) => navigateToProfile(userInfo.id)}>View Profile</button>
                </div>
              </div>
            :
              <div>
                <hr />
                <div>
                  <Link to={`/dashboard/${sessionId}`} className="btn text-white sideBarBtn" style={{fontWeight: 'bold', backgroundColor: "#483D8B"}}>Explore</Link>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default SideBarProfile