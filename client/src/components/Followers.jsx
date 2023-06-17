import React from 'react'
import { useEffect, useState} from 'react'

export const Followers = (props) => {
    const {allFollowers} = props



  return (
    <div className='border rounded mt-3'>
        <h1>Followers</h1>
        <div className='d-flex flex-column'>
            {allFollowers.map((follower, index) => {
                return (
                    <div key={index}>
                        <h3>{follower.user_name}</h3>
                        <h4>{follower.occupation}</h4>
                    </div>
                )
            })}
        </div>

    </div>
  )
}
