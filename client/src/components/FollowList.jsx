import React from 'react'

const FollowList = (props) => {
    const {allFollows} = props
  return (
    <div className='border rounded mt-3'>
        <h1>Following</h1>
        <div className='d-flex flex-column'>
            {allFollows.map((follow, index) => {
                return (
                    <div key={index}>
                        <h3>{follow.user_name}</h3>
                        <h4>{follow.occupation}</h4>
                    </div>
                )
            })}
        </div>
    </div>
  )
}


export default FollowList