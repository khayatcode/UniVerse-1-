import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';
import { Link } from 'react-router-dom';



const SideBarProfile = (props) => {
  const { userInfo, navigateToProfile, sessionId, numberOfFollowers, numberOfFollows, numberOfPosts, isInProfile } = props
  const navigate = useNavigate()

  const editProfile = (e) => {
    e.preventDefault()
    navigate('/profile/edit/' + sessionId)
  }


  return (
    <div className='d-flex align-items-center mb-3' style={{marginTop: "0.7%"}}>
      <div className="card" style={{ width: '400px' }}>
        <div className="card-body rounded" style={{backgroundColor: "#f2f2f2"}}>
          <img src={userInfo.profile_pic} height={100} width={100} className='rounded-circle' style={{ borderRadius: '50%' }} />
          <hr />
          <div className="d-flex align-items-center justify-content-between" style={{marginLeft: "10%"}}>
            <h6 className="card-title "><strong>User Name:</strong></h6>
            <p className="card-text mb-1 " style={{marginRight: "20%"}}>{userInfo.user_name}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-between" style={{marginLeft: "10%"}}>
            <h6 className="card-subtitle "><strong>Occupation:</strong></h6>
            <p className="card-text mb-1" style={{marginRight: "20%"}}>{userInfo.occupation}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-between" style={{marginLeft: "10%"}}>
            <h6 className="card-subtitle "><strong>Followers:</strong></h6>
            <p className="card-text mb-1" style={{marginRight: "20%"}}>{numberOfFollowers}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-between" style={{marginLeft: "10%"}}>
            <h6 className="card-subtitle "><strong>Following:</strong></h6>
            <p className="card-text mb-1" style={{marginRight: "20%"}}>{numberOfFollows}</p>
          </div>
          <hr />
          <div className="d-flex align-items-center justify-content-between" style={{marginLeft: "10%"}}>
            <h6 className="card-subtitle "><strong>Posts:</strong></h6>
            <p className="card-text mb-1" style={{marginRight: "20%"}}>{numberOfPosts}</p>
          </div>
          {isInProfile ?
              <div>
                <hr />
                <div>
                  <Link to={`/dashboard/${sessionId}`} className="btn text-white" style={{fontWeight: 'bold', backgroundColor: "#483D8B"}}>Explore</Link>
                </div>
              </div>
            : userInfo.id == sessionId ?
              <div>
                <hr />
                <div>
                  <button className="btn text-white" style={{fontWeight: 'bold', backgroundColor: "#483D8B"}} onClick={(e) => navigateToProfile(userInfo.id)}>View Profile</button>
                </div>
              </div>
            :
              <div>
                <hr />
                <div>
                  <Link to={`/dashboard/${sessionId}`} className="btn text-white" style={{fontWeight: 'bold', backgroundColor: "#483D8B"}}>Explore</Link>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default SideBarProfile