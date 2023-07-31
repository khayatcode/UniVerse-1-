import React from 'react'
import { useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import "../styles/Follow.css"

export const Followers = (props) => {
    const {allFollowers, numberOfFollowers} = props



  return (
    <div className='border rounded mt-3 p-2' style={{backgroundColor: "#f2f2f2"}}>
        <h4 className='followTitle'>{allFollowers.length} Followers</h4>
        <hr />
        <div className='d-flex flex-column' style={{height: "200px", overflowY: "scroll"}}>
            {allFollowers.length == 0 ?
                <div className='d-flex justify-content-center align-items-center' style={{height: "100%"}}>
                    <h6 className='text-secondary followText'>No Followers</h6>
                </div>
            :
            allFollowers.map((follower, index) => {
                return (
                    <div key={index}>
                        <div className='d-flex justify-content-start align-items-center mt-3 gap-3' style={{marginLeft: "6%"}}>
                            <img src={follower.profile_pic} alt={follower.user_name} className='rounded-circle followPic' />
                            <h6>
                                <Link to={`/profile/${follower.id}`} className="text-decoration-underline text-dark followText">{follower.user_name}</Link>
                            </h6>
                        </div>
                        <hr />
                    </div>
                )
            })
            }
        </div>
    </div>
  )
}
