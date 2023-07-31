import React from 'react'
import DeletePost from './DeletePost'
import { useNavigate } from 'react-router-dom'
import LikeButton from './LikeButton'
import "../styles/AllPosts.css"

const DisplaySinglePost = (props) => {
    const {postInfo, userInfo, sessionId, loggedInUserLikes, addLike, removeLike, allPosts, setAllPosts} = props
    const navigate = useNavigate()

    const navigateToViewPost = (postId, userId) => {
        navigate("/post/view/" + postId + "/" + userId)
    }

    const removePost = (postId) => {
        setAllPosts(allPosts.filter(post => post.id !== postId))
        navigate("/profile/" + sessionId)
    }


  return (
    <div>
        <div className="card">
            <div className="card-body rounded" style={{backgroundColor: "#f2f2f2"}}>
                <div className="d-flex justify-content-start align-items-center gap-3">
                    <img src={userInfo.profile_pic} alt={userInfo.user_name} className='postProfilePic' style={{ borderRadius: "50%" }}/>
                    <h6 className="card-title postUserText"><strong>{userInfo.user_name}</strong></h6>
                </div>
                <hr />
                <p className="card-text text-start mt-1 postUserContent">{postInfo.content}</p>
                {postInfo.post_pic == '' ? null : <img src={postInfo.post_pic} className="card-img-top rounded img-fluid postUserPic" alt="Post Pic"/>}
                <hr />
                <div className='d-flex justify-content-between align-items-center mt-3'>
                    <div className='d-block'>
                        <div className='d-flex gap-2 align-items-center'>
                            <LikeButton
                                sessionId={sessionId}
                                post={postInfo}
                                loggedInUserLikes={loggedInUserLikes}
                                addLike={addLike}
                                removeLike={removeLike}
                            />
                            <p className="card-text postLikes">Likes: {postInfo.likes}</p>
                        </div>
                    </div>
                    <button className="btn btn-sm text-white postActionBtn" style={{backgroundColor: "#8c8c8c"}} onClick={(e) => navigateToViewPost(postInfo.id, userInfo.id)}>View Post/Comments</button>
                </div>
                <div className='d-flex justify-content-center mt-2'>
                    <DeletePost successCallback={() => removePost(postInfo.id)} postId={postInfo.id} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default DisplaySinglePost