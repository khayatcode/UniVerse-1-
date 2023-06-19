import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import SideBarProfile from '../components/SideBarProfile'
import DisplayAllPosts from '../components/DisplayAllPosts'
import Advertisement from '../components/Advertisement'
import CreatePost from '../components/CreatePost'
import FollowList from '../components/FollowList'
import Cookies from 'js-cookie';
import { Followers } from '../components/Followers'

// Do a welcome page with the person name
const Dashboard = (props) => {
    const {sessionId, setSessionId} = props
    const [loaded, setLoaded] = useState(false);
    const [allPosts, setAllPosts] = useState([])
    const [loggedInUserFollows, setLoggedInUserFollows] = useState([])
    const [loggedInUserFollowers, setLoggedInUserFollowers] = useState([])
    const [loggedInUserLikes, setLoggedInUserLikes] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate()

useEffect(() => {
  const userSession = Cookies.get('sessionId');
  if (!userSession) {
    navigate('/login');
  }
  Promise.all([
    fetch(`http://127.0.0.1:5000/get_user/${sessionId}`),
    fetch(`http://127.0.0.1:5000/get_all_follows/${sessionId}`),
    fetch(`http://127.0.0.1:5000/get_all_followers/${sessionId}`),
    fetch('http://127.0.0.1:5000/get_all_posts_with_creator'),
    fetch(`http://127.0.0.1:5000/get_all_users_like_post/${sessionId}`),
  ])
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => {
    const [userInfo, loggedInUserFollows, loggedInUserFollowers, allPosts, allUserLikes] = data;
    setUserInfo(userInfo);
    setLoggedInUserFollows(loggedInUserFollows);
    setLoggedInUserFollowers(loggedInUserFollowers);
    setAllPosts(allPosts);
    setLoggedInUserLikes(allUserLikes);
    setLoaded(true);
  })
  .catch(err => {
    console.log(err);
  });
}, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_all_posts_with_creator')
    .then(response => response.json())
    .then(data => {
      setAllPosts(data)
    })
    .catch(err => {
      console.log(err);
    });
  }, [loggedInUserLikes]);
    
    const removePost = postId => {
        setAllPosts(allPosts.filter(post => post.id !== postId))
    }

    const removeFollow = followId => {
      setLoggedInUserFollows(loggedInUserFollows.filter(follow => follow.id !== followId))
    }
    const addFollow = followData => {
      setLoggedInUserFollows([followData, ...loggedInUserFollows])
    }

    const addLike = likeData => {
      setLoggedInUserLikes([likeData, ...loggedInUserLikes])
    }

    const removeLike = likeId => {
      setLoggedInUserLikes(loggedInUserLikes.filter(like => like.id != likeId))
    }

    const navigateToProfile = (sessionId) => {
      navigate("/profile/" + sessionId)
  }

        
  return (
    <div>
      <NavBar 
        sessionId={sessionId}
        setSessionId={setSessionId}
        navigateToProfile={navigateToProfile}
      />
      {loaded && (
        <div className="d-flex justify-content-around p-5 gap-4">
          <div className="col-3">
            <SideBarProfile userInfo={userInfo} navigateToProfile={navigateToProfile} sessionId={sessionId}/>
            <FollowList allFollows={loggedInUserFollows}/>
          </div>
          <div className="col-6">
            <CreatePost 
              sessionId={sessionId} 
              allPosts={allPosts} 
              setAllPosts={setAllPosts} 
              userInfo={userInfo} />
            <DisplayAllPosts 
              allPosts={allPosts} 
              sessionId={sessionId} 
              removePost={removePost} 
              loggedInUserFollows={loggedInUserFollows} 
              setLoggedInUserFollows={setLoggedInUserFollows} 
              navigateToProfile={navigateToProfile}
              removeFollow={removeFollow}
              addFollow={addFollow}
              loggedInUserLikes={loggedInUserLikes}
              addLike={addLike}
              removeLike={removeLike}
            />
          </div>
          <div className="col-3">
          <Advertisement/>
          <Followers 
            allFollowers={loggedInUserFollowers}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard