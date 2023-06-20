import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import SideBarProfile from '../components/SideBarProfile'
import Advertisement from '../components/Advertisement'
import FollowList from '../components/FollowList'
import DisplayAllUserPosts from '../components/DisplayAllUserPosts'
import { Followers } from '../components/Followers'
import Cookies from 'js-cookie';


const Profile = (props) => {
    const {sessionId, setSessionId} = props
    const [loaded, setLoaded] = useState(false);
    const [allPosts, setAllPosts] = useState([])
    const [allFollows, setAllFollows] = useState([])
    const [allFollowers, setAllFollowers] = useState([])
    const [loggedInUserFollows, setLoggedInUserFollows] = useState([])
    const [loggedInUserLikes, setLoggedInUserLikes] = useState([])
    const [userInfo, setUserInfo] = useState({
        id: "",
        first_name: "",
        last_name: "",
        user_name: "",
        location: "",
        occupation: "",
        email: ""
    }
    )
    const navigate = useNavigate()
    const {userId} = useParams()
    console.log("user id", userId)

 useEffect(() => {
    const userSession = Cookies.get('sessionId');
    if (!userSession) {
        navigate('/login');
    }
  Promise.all([
    fetch(`http://127.0.0.1:5000/get_user/${userId}`),
    fetch('http://127.0.0.1:5000/get_all_posts_by_user/' + userId),
    fetch(`http://127.0.0.1:5000/get_all_follows/${userId}`),
    fetch(`http://127.0.0.1:5000/get_all_follows/${sessionId}`),
    fetch(`http://127.0.0.1:5000/get_all_followers/${userId}`),
    fetch(`http://127.0.0.1:5000/get_all_users_like_post/${sessionId}`),
  ])
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => {
    const [userInfo, allPosts, allFollows, loggedInUserFollows, allFollowers, allUserLikes] = data;
    setUserInfo(userInfo);
    setAllPosts(allPosts);
    setAllFollows(allFollows);
    setLoggedInUserFollows(loggedInUserFollows);
    setAllFollowers(allFollowers);
    setLoggedInUserLikes(allUserLikes);
    setLoaded(true);
  })
  .catch(err => {
    console.log(err);
  });
}, [sessionId, userId]);

    // create a useEffect, everytime you setLoggedInUserFollows, you update the state of allFollowers
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
        fetch('http://127.0.0.1:5000/get_all_posts_by_user/' + userId)
        .then(response => response.json())
        .then(data => {
            setAllPosts(data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [loggedInUserLikes])

    // setAllFollowers(allFollowers.filter(follower => follower.id !== sessionId))
    const removeFollow = (followId) => {
        setAllFollows(allFollows.filter(follower => follower.id !== followId))
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




  return (
    
    <div>
        <NavBar 
            sessionId={sessionId}
            navigateToProfile={navigateToProfile}
            setSessionId={setSessionId}

        />
        {loaded && (
            <div className="d-flex justify-content-around p-5 gap-4" style={{ backgroundColor: '#404040', marginTop: "7%"}}>
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
                    <DisplayAllUserPosts
                        userInfo={userInfo} 
                        allPosts={allPosts} 
                        sessionId={sessionId} 
                        setAllPosts={setAllPosts}  
                        navigateToProfile={navigateToProfile}
                        loggedInUserFollows={loggedInUserFollows}
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
                        allFollowers={allFollowers}
                    />
                </div>
            </div>
        )}
    </div>
  )
}

export default Profile