import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeletePost from './DeletePost'
import AddFollow from './AddFollow'
import LikeButton from './LikeButton'
import "../styles/AllPosts.css"

const DisplayUserPost = (props) => {
    const { userInfo, allPosts, sessionId, removePost, loggedInUserFollows, removeFollow, addFollow, loggedInUserLikes, addLike, removeLike } = props

    const sortPosts = (posts) => {
        return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    const navigate = useNavigate()

    const navigateToEdit = (postId) => {
        navigate("/post/edit/" + postId)
    }

    const navigateToViewPost = (postId, userId) => {
        navigate("/post/view/" + postId + "/" + userId)
    }



    return (
        <div>
            {sortPosts(allPosts).length > 0 ? (allPosts.map((post, index) => {
                return (
                    <div key={index} className='mb-3'>
                        <div className="card">
                            <div className="card-body rounded" style={{ backgroundColor: "#f2f2f2" }}>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                    <div className="d-flex justify-content-around align-items-center gap-3">
                                        <img src={userInfo.profile_pic} alt={userInfo.user_name} className='postProfilePic' style={{ borderRadius: "50%" }} />
                                        <h6 className="card-title mb-2 postUserText"><strong>{userInfo.user_name}</strong></h6>
                                    </div>
                                    <AddFollow
                                        sessionId={sessionId}
                                        post={post}
                                        loggedInUserFollows={loggedInUserFollows}
                                        removeFollow={removeFollow}
                                        addFollow={addFollow}
                                    />
                                </div>
                                <hr />
                                <p className="card-text text-start mt-1 postUserContent">{post.content}</p>
                                {post.post_pic == '' ? null : <img src={post.post_pic} className="card-img-top rounded img-fluid postUserPic" alt="Post Pic"/>}
                                <hr />
                                <div className='d-flex justify-content-between align-items-center mt-3'>
                                    <div className='d-block'>
                                        <div className='d-flex gap-2 align-items-center'>
                                            <LikeButton
                                                sessionId={sessionId}
                                                post={post}
                                                loggedInUserLikes={loggedInUserLikes}
                                                addLike={addLike}
                                                removeLike={removeLike}
                                            />
                                            <p className="card-text postLikes">Likes: {post.likes}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="btn btn-sm text-white postActionBtn" style={{backgroundColor: "#8c8c8c"}} onClick={(e) => navigateToViewPost(post.id, userInfo.id)}>View/Comments</button>
                                    </div>
                                </div>
                                {post.user_id == sessionId ?
                                    <div className='d-flex justify-content-center gap-2 mt-2'>
                                        <button className="btn btn-sm text-white postActionBtn" style={{backgroundColor: "#483D8B"}} onClick={(e) => navigateToEdit(post.id)}>Edit</button>
                                        <DeletePost successCallback={() => removePost(post.id)} postId={post.id} />
                                    </div> : null}
                            </div>
                        </div>
                    </div>

                )
            })
            ) : <h3 className='text-white mt-5'>No Posts Yet</h3>}
        </div>
    )
}

export default DisplayUserPost