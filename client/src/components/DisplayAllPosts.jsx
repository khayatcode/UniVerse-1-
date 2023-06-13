import React from 'react'
import { useEffect } from 'react'
import DeleteStore from './DeleteStore'

const DisplayAllPosts = (props) => {
    const {allPosts, userId, removeFromDom, allFriends, setAllFriends} = props

    const sortPosts = (posts) => {
        return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    
    const submitFriendHandler = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/add_friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: e.target.user_id.value,
                friend_id: e.target.friend_id.value
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("data in submitFriend", data)
            if (data.success) {
                console.log("Friend has been added")
                setAllFriends([data.friend, ...allFriends])
            }
        })
        .catch(err => {
            console.log(err)
            console.log("There was an error adding the friend")
        })
    }

  return (
    <div>
        {sortPosts(allPosts).length > 0 ? (allPosts.map((post, index) => {
            return (
                <div key={index} className='mt-2'>
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex">
                                <h6 className="card-subtitle mb-2 text-muted">Posted by: {post.creator.user_name}</h6>
                                <a href="#" className="card-link">View Profile</a>
                                <form onSubmit={submitFriendHandler}>
                                    <input type="hidden" name="user_id" value={userId}/>
                                    <input type="hidden" name="friend_id" value={post.creator.id}/>
                                    <input type="submit" value="Add Friend" className="btn btn-primary"/>
                                </form>
                            </div>
                            <h5 className="card-title">{post.content}</h5>
                            <p className="card-text">Likes: {post.likes}</p>
                            {post.creator.id == userId ?
                            <div>
                                <a href="#" className="card-link">Edit</a>
                                <DeleteStore successCallback={() => removeFromDom(post.id)} postId={post.id}/>
                            </div> : null}
                        </div>
                    </div>
                </div>

            )
        })
        ) : <p>No Posts Yet</p>}
    </div>
  )
}

export default DisplayAllPosts