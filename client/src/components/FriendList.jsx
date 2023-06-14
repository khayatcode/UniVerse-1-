import React from 'react'
import { useEffect} from 'react'


const FriendList = (props) => {
    const {allFriends, setAllFriends, userId} = props
  return (
    <div className='border rounded mt-3'>
        <h1>Friend List</h1>
        <div className='d-flex flex-column'>
            {allFriends.map((friend, index) => {
                return (
                    <div key={index}>
                        <h3>{friend.user_name}</h3>
                        <h4>{friend.occupation}</h4>
                    </div>
                )
            })}
        </div>
    </div>
  )
}


export default FriendList