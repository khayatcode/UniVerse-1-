import React from 'react'
import NavBar from './NavBar'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { Followers } from './Followers'
import AllComments  from './AllComments'
import AddFollow from './AddFollow';
import LikeButton from './LikeButton';
import SideBarProfile from './SideBarProfile';
import AddComment from './AddComment';
import Advertisement from './Advertisement';
import FollowList from './FollowList';
import DeletePost from './DeletePost';



const ViewPost = (props) => {
  const {sessionId, setSessionId} = props
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({})
  const [postInfo, setPostInfo] = useState({})
  const [allComments, setAllComments] = useState([])
  const [allFollows, setAllFollows] = useState([])
  const [allFollowers, setAllFollowers] = useState([])
  const [loggedInUserFollows, setLoggedInUserFollows] = useState([])
  const [loggedInUserLikes, setLoggedInUserLikes] = useState([])
  const [loggedInUserData, setLoggedInUserData] = useState({})

  const navigate = useNavigate()
  const {postId} = useParams()
  const {userId} = useParams()

  useEffect(() => {
    const userSession = Cookies.get('sessionId');
    if (!userSession) {
      navigate('/login');
    }

  Promise.all([
    fetch(`http://127.0.0.1:5000/get_user/${userId}`),
    fetch(`http://127.0.0.1:5000/get_one_post/${postId}`),
    fetch(`http://127.0.0.1:5000//get_all_comments_for_post/${postId}`),
    fetch(`http://127.0.0.1:5000/get_all_follows/${userId}`),
    fetch(`http://127.0.0.1:5000/get_all_followers/${userId}`),
    fetch(`http://127.0.0.1:5000/get_all_follows/${sessionId}`),
    fetch(`http://127.0.0.1:5000/get_all_users_like_post/${sessionId}`),
    fetch(`http://127.0.0.1:5000/get_user/${sessionId}`),
  ])
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => {
    const [userInfo, postInfo, allComments, allFollows, allFollowers, loggedInUserFollows, loggedInUserLikes, loggedInUserData] = data;
    setUserInfo(userInfo);
    setPostInfo(postInfo);
    setAllComments(allComments);
    setAllFollows(allFollows);
    setAllFollowers(allFollowers);
    setLoggedInUserFollows(loggedInUserFollows);
    setLoggedInUserLikes(loggedInUserLikes);
    setLoggedInUserData(loggedInUserData);
    setLoaded(true);
  })
  .catch(err => {
    console.log(err);
  });
}, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get_all_followers/${userId}`)
    .then(response => response.json())
    .then(data => {
        setAllFollowers(data)
    })
    .catch(err => {
        console.log(err)
    })
  }, [loggedInUserFollows])

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get_one_post/${postId}`)
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

  // setAllFollowers([loggedInUserData, ...allFollowers])
  const addFollow = (followerData ) => {
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
    setAllComments([commentData,...allComments])
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
      {loaded && (
        <div className="d-flex justify-content-around p-5 gap-4">
          <div className="col-3">
              <SideBarProfile 
                  userInfo={userInfo} 
                  navigateToProfile={navigateToProfile}
                  sessionId={sessionId}
              />
              <FollowList allFollows={allFollows}/>
          </div>
          <div className="col-6">
            <AddComment 
              postId={postInfo.id}
              sessionId={sessionId}
              addCommentToPost={addCommentToPost}
              loggedInUserData={loggedInUserData}
              />
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Posted by: {userInfo.user_name}</h5>
                <AddFollow 
                  sessionId={sessionId} 
                  post={postInfo} 
                  loggedInUserFollows={loggedInUserFollows} 
                  removeFollow={removeFollow}
                  addFollow={addFollow}
                /> 
                <LikeButton
                  sessionId={sessionId}
                  post={postInfo}
                  loggedInUserLikes={loggedInUserLikes}
                  addLike={addLike}
                  removeLike={removeLike}
                />
                <p className="card-text">{postInfo.content}</p>
                <p className="card-text">{postInfo.likes} likes</p>
                <img src={postInfo.post_pic} className="card-img-top" alt="Post Pic"/>
                {postInfo.user_id == sessionId ?
                  <div>
                      <button className="btn btn-link" onClick={(e) => navigateToEdit(postInfo.id)}>Edit</button>
                      <DeletePost successCallback={() => removePost(postInfo.id)} postId={postInfo.id}/>
                  </div> 
                  : null}
                <button className="btn btn-link" onClick={(e) => navigateToViewPost(postInfo.id, userInfo.id)}>View Post/Comment</button>
              </div>
            </div>
            <AllComments
              allComments={allComments}
              removeComment={removeComment}
              sessionId={sessionId}
            />
          </div>
          <div className="col-3">
            <Advertisement />
            <Followers
              allFollowers={allFollowers}
              />
          </div>
        </div>
        )}
    </div>
  )
}
export default ViewPost