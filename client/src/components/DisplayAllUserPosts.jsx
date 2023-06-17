import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom'
import DeletePost from './DeletePost'
import AddFollow from './AddFollow'
import LikeButton from './LikeButton'

const DisplayUserPost = (props) => {
    const {userInfo, allPosts, sessionId, removePost, loggedInUserFollows, removeFollow, addFollow, loggedInUserLikes, addLike, removeLike} = props
    
    const sortPosts = (posts) => {
        return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    
    const navigate = useNavigate()

    const navigateToEdit = (postId) => {
        navigate("/post/edit/" + postId)
    }



  return (
    <div>
        {sortPosts(allPosts).length > 0 ? (allPosts.map((post, index) => {
            return (
                <div key={index} className='mt-2'>
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex">
                                <h6 className="card-subtitle mb-2 text-muted">Posted by: {userInfo.user_name}</h6>
                                <AddFollow 
                                    sessionId={sessionId} 
                                    post={post} 
                                    loggedInUserFollows={loggedInUserFollows} 
                                    removeFollow={removeFollow}
                                    addFollow={addFollow}
                                /> 
                                <LikeButton
                                    sessionId={sessionId}
                                    post={post}
                                    loggedInUserLikes={loggedInUserLikes}
                                    addLike={addLike}
                                    removeLike={removeLike}
                                />
                            </div>
                            <h5 className="card-title">{post.content}</h5>
                            <p className="card-text">Likes: {post.likes}</p>
                            {post.user_id == sessionId ?
                            <div>
                                <button className="btn btn-link" onClick={(e) => navigateToEdit(post.id)}>Edit</button>
                                <DeletePost successCallback={() => removePost(post.id)} postId={post.id}/>
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

export default DisplayUserPost