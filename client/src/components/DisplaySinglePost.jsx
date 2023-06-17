import React from 'react'
import DeletePost from './DeletePost'

const DisplaySinglePost = (props) => {
    const {postInfo, userInfo, navigateToProfile, sessionId} = props

  return (
    <div>
        <div className="card">
            <div className="card-body">
                <div className="d-flex">
                    <h6 className="card-subtitle mb-2 text-muted">Posted by: {userInfo.user_name}</h6>
                </div>
                <h5 className="card-title">{postInfo.content}</h5>
                <p className="card-text">Likes: {postInfo.likes}</p>
                <DeletePost successCallback={() => navigateToProfile(sessionId)} postId={postInfo.id}/>
            </div>
        </div>
    </div>
  )
}

export default DisplaySinglePost