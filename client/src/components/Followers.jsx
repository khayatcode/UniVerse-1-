import React from 'react'
import { useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

export const Followers = (props) => {
    const {allFollowers} = props



  return (
    <div className='border rounded mt-3 p-3' style={{backgroundColor: "#f2f2f2"}}>
        <h4>Followers</h4>
        <hr />
        <div className='d-flex flex-column' style={{height: "150px", overflowY: "scroll"}}>
            {allFollowers.map((follower, index) => {
                return (
                    <div>
                        <div key={index} className='d-flex justify-content-around align-items-center mt-3'>
                            <img src={follower.profile_pic} alt={follower.user_name} className='rounded-circle' style={{ width: '50px', height: '50px' }} />
                            <h6>
                                <Link to={`/profile/${follower.id}`} className="text-decoration-underline text-dark">{follower.user_name}</Link>
                            </h6>
                        </div>
                        <hr />
                    </div>
                )
            })}
        </div>
    </div>
  )
}
