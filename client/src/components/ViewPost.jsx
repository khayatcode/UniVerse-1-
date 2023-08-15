import React from 'react'
import NavBar from './NavBar'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import AllComments from './AllComments'
import AddFollow from './AddFollow';
import LikeButton from './LikeButton';
import SideBarProfile from './SideBarProfile';
import AddComment from './AddComment';
import DeletePost from './DeletePost';
import MilkyWay from '../images/milkyWay.jpeg'
import { Link } from 'react-router-dom';
import "../styles/AllPosts.css"



const ViewPost = (props) => {
  const { sessionId, setSessionId } = props
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({})
  const [postInfo, setPostInfo] = useState({})
  const [allPosts, setAllPosts] = useState([])
  const [allComments, setAllComments] = useState([])
  const [allFollows, setAllFollows] = useState([])
  const [allFollowers, setAllFollowers] = useState([])
  const [loggedInUserFollows, setLoggedInUserFollows] = useState([])
  const [loggedInUserLikes, setLoggedInUserLikes] = useState([])
  const [loggedInUserData, setLoggedInUserData] = useState({})

  const navigate = useNavigate()
  const { postId } = useParams()
  const { userId } = useParams()

  useEffect(() => {
    if (Cookies.get('sessionId') == "") {
      console.log("redirecting to login")
      return navigate('/login')
  }

    Promise.all([
      fetch(`/get_user/${userId}`),
      fetch(`/get_one_post/${postId}`),
      fetch(`//get_all_comments_for_post/${postId}`),
      fetch(`/get_all_follows/${userId}`),
      fetch(`/get_all_followers/${userId}`),
      fetch(`/get_all_follows/${sessionId}`),
      fetch(`/get_all_users_like_post/${sessionId}`),
      fetch(`/get_user/${sessionId}`),
      fetch('/get_all_posts_by_user/' + userId),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
        const [userInfo, postInfo, allComments, allFollows, allFollowers, loggedInUserFollows, loggedInUserLikes, loggedInUserData, allPosts] = data;
        setUserInfo(userInfo);
        setPostInfo(postInfo);
        setAllComments(allComments);
        setAllFollows(allFollows);
        setAllFollowers(allFollowers);
        setLoggedInUserFollows(loggedInUserFollows);
        setLoggedInUserLikes(loggedInUserLikes);
        setLoggedInUserData(loggedInUserData);
        setAllPosts(allPosts);
        setLoaded(true);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch(`/get_all_followers/${userId}`)
      .then(response => response.json())
      .then(data => {
        setAllFollowers(data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [loggedInUserFollows])

  useEffect(() => {
    fetch(`/get_one_post/${postId}`)
      .then(response => response.json())
      .then(data => {
        setPostInfo(data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [loggedInUserLikes])

  const navigateToEdit = (postId) => {
    navigate("/post/edit/" + postId)
  }

  const removeFollow = (followId) => {
    setLoggedInUserFollows(loggedInUserFollows.filter(follower => follower.id !== followId))
  }
  const removePost = postId => {
    setAllPosts(allPosts.filter(post => post.id !== postId))
  }

  // setAllFollowers([loggedInUserData, ...allFollowers])
  const addFollow = (followerData) => {
    setLoggedInUserFollows([followerData, ...loggedInUserFollows])
  }
  const navigateToProfile = (sessionId) => {
    navigate("/profile/" + sessionId)
  }

  const addLike = likeData => {
    setLoggedInUserLikes([likeData, ...loggedInUserLikes])
  }

  const removeLike = likeId => {
    setLoggedInUserLikes(loggedInUserLikes.filter(like => like.id != likeId))
  }

  const addCommentToPost = commentData => {
    setAllComments([commentData, ...allComments])
  }

  const removeComment = commentId => {
    setAllComments(allComments.filter(comment => comment.id != commentId))
  }
  const navigateToViewPost = (postId, userId) => {
    navigate("/post/view/" + postId + "/" + userId)
  }
  return (
    <div>
      <NavBar
        sessionId={sessionId}
        navigateToProfile={navigateToProfile}
        setSessionId={setSessionId}

      />
      <div className='pb-3' style={{ backgroundImage: `url(${MilkyWay})`, minHeight: "100vh", paddingTop: "150px" }}>
        {loaded && (
          <div className='container-fluid'>
            <div style={{ width: "23%", position: 'fixed' }}>
              <SideBarProfile
                userInfo={userInfo}
                navigateToProfile={navigateToProfile}
                sessionId={sessionId}
                numberOfFollowers={allFollowers.length}
                numberOfFollows={allFollows.length}
                numberOfPosts={allPosts.length}
              />
            </div>
            <div className="d-flex justify-content-center">
              <div style={{ width: "65%", marginLeft: "23%" }}>
                <AddComment
                  postId={postInfo.id}
                  sessionId={sessionId}
                  addCommentToPost={addCommentToPost}
                  loggedInUserData={loggedInUserData}
                />
                <div className="card mt-3 ">
                  <div className="card-body rounded" style={{ backgroundColor: "#f2f2f2" }}>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                      <div className='d-flex justify-content-around align-items-center gap-3'>
                        <img src={userInfo.profile_pic} alt={userInfo.user_name} className='postProfilePic' style={{ borderRadius: "50%" }} />
                        <h6 className="card-title postUserText"><strong>{userInfo.user_name}</strong></h6>
                      </div>
                      <div className="d-flex justify-content-end align-items-center gap-3">
                        <Link to={"/profile/" + userInfo.id} className="btn btn-outline-secondary postUserBtn">View Profile</Link>
                        <AddFollow
                          sessionId={sessionId}
                          post={postInfo}
                          loggedInUserFollows={loggedInUserFollows}
                          removeFollow={removeFollow}
                          addFollow={addFollow}
                        />
                      </div>
                    </div>
                    <hr />
                    <p className="card-text text-start mt-1 postUserContent">{postInfo.content}</p>
                    {postInfo.post_pic == '' ? null : <img src={postInfo.post_pic} alt={postInfo.content} className="card-img-top mt-1 rounded img-fluid postUserPic" />}
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
                    </div>

                    {postInfo.user_id == sessionId ?
                      <div className='d-flex justify-content-center gap-2 mt-4'>
                        <button className="btn btn-sm text-white postActionBtn" style={{ backgroundColor: "#483D8B" }} onClick={(e) => navigateToEdit(postInfo.id)}>Edit</button>
                        <DeletePost successCallback={(e) => navigate("/profile/" + sessionId)} postId={postInfo.id} />
                      </div>
                      : null}
                  </div>
                </div>
                {allComments.length > 0 ?
                  <div>
                    <AllComments
                      allComments={allComments}
                      removeComment={removeComment}
                      sessionId={sessionId}
                    />
                  </div>
                  : <div className="card mt-3">
                    <div className="card-body" style={{ backgroundColor: "#f2f2f2" }}>
                      <h3 className="card-title">No Comments</h3>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default ViewPost