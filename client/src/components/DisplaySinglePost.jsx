import React from 'react'
import DeletePost from './DeletePost'
import { useNavigate } from 'react-router-dom'

const DisplaySinglePost = (props) => {
    const {postInfo, userInfo, navigateToProfile, sessionId} = props
    const navigate = useNavigate()

    const navigateToViewPost = (postId, userId) => {
        navigate("/post/view/" + postId + "/" + userId)
    }

  return (
    <div>
        <div className="card">
            <div className="card-body">
                <div className="d-flex">
                    <h6 className="card-subtitle mb-2 text-muted">Posted by: {userInfo.user_name}</h6>
                </div>
                <h5 className="card-title">{postInfo.content}</h5>
                <p className="card-text">Likes: {postInfo.likes}</p>
                <img src={postInfo.post_pic} className="card-img-top" alt="Post Pic"/>
                <DeletePost successCallback={() => navigateToProfile(sessionId)} postId={postInfo.id}/>
                <button className="btn btn-link" onClick={(e) => navigateToViewPost(postInfo.id, userInfo.id)}>View Post/Comments</button>
            </div>
        </div>
    </div>
  )
}

export default DisplaySinglePost