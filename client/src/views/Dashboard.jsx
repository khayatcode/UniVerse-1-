import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import SideBarProfile from '../components/SideBarProfile'
import DisplayAllPosts from '../components/DisplayAllPosts'
import Advertisement from '../components/Advertisement'
import CreatePost from '../components/CreatePost'
import FollowList from '../components/FollowList'
import Cookies from 'js-cookie';
import { Followers } from '../components/Followers'
import MilkyWay from '../images/milkyWay.jpeg'

// Do a welcome page with the person name
const Dashboard = (props) => {
    const {sessionId, setSessionId} = props
    const [loaded, setLoaded] = useState(false);
    const [allPosts, setAllPosts] = useState([])
    const [loggedInUserFollows, setLoggedInUserFollows] = useState([])
    const [loggedInUserFollowers, setLoggedInUserFollowers] = useState([])
    const [loggedInUserLikes, setLoggedInUserLikes] = useState([])
    const [loggedInUserPosts, setLoggedInUserPosts] = useState([])
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
    fetch('http://127.0.0.1:5000/get_all_posts_by_user/' + sessionId),
  ])
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => {
    const [userInfo, loggedInUserFollows, loggedInUserFollowers, allPosts, allUserLikes, loggedInUserPosts] = data;
    setUserInfo(userInfo);
    setLoggedInUserFollows(loggedInUserFollows);
    setLoggedInUserFollowers(loggedInUserFollowers);
    setAllPosts(allPosts);
    setLoggedInUserLikes(allUserLikes);
    setLoggedInUserPosts(loggedInUserPosts);
    setLoaded(true);
  })
  .catch(err => {
    console.log(err);
  });
}, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_all_posts_with_creator')
    .then(data => data.json())
    .then(data => {
      setAllPosts(data)
    })
    .catch(err => {
      console.log(err);
    });
  }, [loggedInUserLikes]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_all_posts_by_user/' + sessionId)
    .then(response => response.json())
    .then(data => {
      setLoggedInUserPosts(data)
    })
    .catch(err => {
      console.log(err);
    });
    }, [allPosts]);


    
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
    const navigateToDashboard = (sessionId) => {
      navigate("/dashboard/" + sessionId)
  }

        
  return (
    <div >
      <NavBar 
        sessionId={sessionId}
        setSessionId={setSessionId}
        navigateToProfile={navigateToProfile}
      />
      <div style={{backgroundImage: `url(${MilkyWay})`, minHeight: "100vh", paddingTop: "150px"}}>
        {loaded && (
          <div className='container-fluid'> 
            <div className='' style={{width: "23%", position: 'fixed' }}>
              <SideBarProfile 
                userInfo={userInfo} 
                navigateToProfile={navigateToProfile} 
                sessionId={sessionId}
                numberOfFollowers={loggedInUserFollowers.length}
                numberOfFollows={loggedInUserFollows.length}
                numberOfPosts={loggedInUserPosts.length}
                />
            </div>
            <div className="d-flex justify-content-end">
              <div className="" style={{width: "50%"}}>
                <CreatePost 
                  sessionId={sessionId} 
                  allPosts={allPosts} 
                  setAllPosts={setAllPosts} 
                  userInfo={userInfo} 
                  navigateFunction={navigateToDashboard}
                  />

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
              <div className="" style={{width: "23%", marginLeft: "1.8%" }}>
                <Advertisement />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard