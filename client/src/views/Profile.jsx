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
import CreatePost from '../components/CreatePost'
import MilkyWay from '../images/milkyWay.jpeg'


const Profile = (props) => {
    const {sessionId, setSessionId} = props
    const [loaded, setLoaded] = useState(false);
    const [allPosts, setAllPosts] = useState([])
    const [allFollows, setAllFollows] = useState([])
    const [allFollowers, setAllFollowers] = useState([])
    const [loggedInUserFollows, setLoggedInUserFollows] = useState([])
    const [loggedInUserLikes, setLoggedInUserLikes] = useState([])
    const [isInProfile, setIsInProfile] = useState(true)
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
    if (Cookies.get('sessionId') == "") {
        console.log("redirecting to login")
        return navigate('/login')
    }
  Promise.all([
    fetch(`/get_user/${userId}`),
    fetch('/get_all_posts_by_user/' + userId),
    fetch(`/get_all_follows/${userId}`),
    fetch(`/get_all_follows/${sessionId}`),
    fetch(`/get_all_followers/${userId}`),
    fetch(`/get_all_users_like_post/${sessionId}`),
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
        Promise.all([
            fetch(`/get_all_followers/${userId}`),
            fetch(`/get_all_follows/${userId}`)
        ])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            const [allFollowers, allFollows] = data;
            setAllFollowers(allFollowers);
            setAllFollows(allFollows);
        }
        )
    }, [loggedInUserFollows])

    useEffect(() => {
        fetch('/get_all_posts_by_user/' + userId)
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
        setLoggedInUserFollows(loggedInUserFollows.filter(follower => follower.id !== followId))
    }

    const removePost = postId => {
        setAllPosts(allPosts.filter(post => post.id !== postId))
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
        <div style={{backgroundImage: `url(${MilkyWay})`, minHeight: "100vh", paddingTop: "150px" }}>
            {loaded && (
                <div className='container-fluid'>
                    <div className='' style={{width: "23%", position: 'fixed' }}>
                        <SideBarProfile 
                            userInfo={userInfo} 
                            navigateToProfile={navigateToProfile}
                            sessionId={sessionId}
                            numberOfFollowers={allFollowers.length}
                            numberOfFollows={allFollows.length}
                            numberOfPosts={allPosts.length}
                            isInProfile={isInProfile}
                        />
                    </div>

                    <div className="d-flex justify-content-end ">
                        <div className='postContainer' style={{width: "50%"}}>
                            { userInfo.id == sessionId ? 
                                <div className="">
                                    <CreatePost
                                        sessionId={sessionId}
                                        setAllPosts={setAllPosts}
                                        allPosts={allPosts}
                                        userInfo={userInfo}
                                        navigateFunction={navigateToProfile}
                                    /> 
                                </div>
                                : null
                            }
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
                                removePost={removePost}
                            />
                        </div>
                        <div className="" style={{ width: "23%", marginLeft: "1.8%"}}>
                            <FollowList 
                                allFollows={allFollows}
                                removeFollow={removeFollow}
                                userInfo={userInfo}
                                sessionId={sessionId}
                            />
                            <Followers
                                allFollowers={allFollowers}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default Profile