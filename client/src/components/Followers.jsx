import React from 'react'
import { useEffect, useState} from 'react'

export const Followers = (props) => {
    const {allFollowers} = props



  return (
    <div className='border rounded mt-3 p-3' style={{backgroundColor: "#f2f2f2"}}>
        <h4>Followers</h4>
        <hr />
        <div className='d-flex flex-column'>
            {allFollowers.map((follower, index) => {
                return (
                    <div key={index} className='d-flex justify-content-around align-items-center'>
                        <img src={follower.profile_pic} alt={follower.user_name} className='rounded-circle' style={{ width: '50px', height: '50px' }} />
                        <h6>{follower.user_name}</h6>
                    </div>
                )
            })}
        </div>
    </div>
  )
}
