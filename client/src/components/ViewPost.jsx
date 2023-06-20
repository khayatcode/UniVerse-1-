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
import MilkyWay from '../images/milkyWay.jpeg'



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
        <div className="d-flex justify-content-around p-5 gap-4" style={{backgroundImage: `url(${MilkyWay})`, marginTop: "7%"}}>
          <div className="col-3">
              <SideBarProfile 
                  userInfo={userInfo} 
                  navigateToProfile={navigateToProfile}
                  sessionId={sessionId}
              />
              <FollowList 
                allFollows={allFollows}
                removeFollow={removeFollow}
                userInfo={userInfo}
                sessionId={sessionId}
              />
          </div>
          <div className="col-6">
            <AddComment 
              postId={postInfo.id}
              sessionId={sessionId}
              addCommentToPost={addCommentToPost}
              loggedInUserData={loggedInUserData}
              />
            <div className="card mt-3">
              <div className="card-body" style={{backgroundColor: "#f2f2f2"}}>
                <div className="row d-flex align-items-center gap-2">
                    <div className='d-flex justify-content-start align-items-center gap-3'>
                      <img src={userInfo.profile_pic} alt={userInfo.user_name} className='rounded-circle' style={{width: '65px', height: '65px'}}/>
                      <h6 className="card-title "><strong><em>{userInfo.user_name}</em></strong></h6>
                    </div>
                    <div className='d-flex justify-content-end align-items-center gap-3'>
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
                <p className="card-text text-start">{postInfo.content}</p>
                <img src={postInfo.post_pic} className="card-img-top rounded" alt="Post Pic"/>
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
                        <p className="card-text">{postInfo.likes} likes</p>
                      </div>
                  </div>
                  <div>
                      <button className="btn btn-sm text-white" style={{backgroundColor: "#8c8c8c"}} onClick={(e) => navigateToViewPost(post.id, userInfo.id)}>View/Comments</button>
                  </div>
                </div>

                {postInfo.user_id == sessionId ?
                  <div className='d-flex justify-content-center gap-2 mt-2'>
                      <button className="btn btn-sm text-white" style={{backgroundColor: "#483D8B"}} onClick={(e) => navigateToEdit(postInfo.id)}>Edit</button>
                      <DeletePost successCallback={() => removePost(postInfo.id)} postId={postInfo.id}/>
                  </div> 
                  : null}
              </div>
            </div>
            { allComments.length > 0 ?
              <div>
                <AllComments
                allComments={allComments}
                removeComment={removeComment}
                sessionId={sessionId}
              />
              </div>
              : <card className="card mt-3">
                  <div className="card-body" style={{backgroundColor: "#f2f2f2"}}>
                    <h3 className="card-title">No Comments</h3>
                  </div>
                </card>

            }
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