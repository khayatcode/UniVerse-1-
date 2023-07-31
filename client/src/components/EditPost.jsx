import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar'
import SideBarProfile from './SideBarProfile'
import DisplaySinglePost from './DisplaySinglePost';
import Cookies from 'js-cookie';
import MilkyWay from '../images/milkyWay.jpeg'
import "../styles/CreatePost.css"



const EditPost = (props) => {
  const {sessionId, setSessionId} = props
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({})
  const [postInfo, setPostInfo] = useState({})
  const [userInfo, setUserInfo] = useState({})
  const [loggedInUserLikes, setLoggedInUserLikes] = useState([])
  const [loggedInUserFollowers, setLoggedInUserFollowers] = useState([])
  const [loggedInUserFollows, setLoggedInUserFollows] = useState([])
  const [loggedInUserPosts, setLoggedInUserPosts] = useState([])
  const [updatedPostInfo, setUpdatedPostInfo] = useState({
    id: "",
    content : "",
    user_id: sessionId,
    creator: userInfo
  })
  const navigate = useNavigate()
  const {postId} = useParams()

  const changeHandler = (e) => {
    setUpdatedPostInfo({
      ...updatedPostInfo,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    const userSession = Cookies.get('sessionId');
    if (!userSession) {
      navigate('/login');
    }
    Promise.all([
      fetch(`http://127.0.0.1:5000/get_user/${sessionId}`),
      fetch(`http://127.0.0.1:5000/get_one_post/${postId}`),
      fetch(`http://127.0.0.1:5000/get_all_users_like_post/${sessionId}`),
      fetch(`http://127.0.0.1:5000/get_all_follows/${sessionId}`),
      fetch(`http://127.0.0.1:5000/get_all_followers/${sessionId}`),
      fetch('http://127.0.0.1:5000/get_all_posts_by_user/' + sessionId),
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
      const [userInfo, postInfo, loggedInUserLikes, loggedInUserFollows, loggedInUserFollowers, loggedInUserPosts] = data;
      setUserInfo(userInfo);
      setPostInfo(postInfo);
      setUpdatedPostInfo(postInfo);
      setLoggedInUserLikes(loggedInUserLikes);
      setLoggedInUserFollows(loggedInUserFollows);
      setLoggedInUserFollowers(loggedInUserFollowers);
      setLoggedInUserPosts(loggedInUserPosts);
      setLoaded(true);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get_one_post/${postId}`)
    .then(response => response.json())
    .then(data => {
      setPostInfo(data)
      setUpdatedPostInfo(data)
    })
    .catch(err => {
      console.log(err)
    })
    }, [loggedInUserLikes])


  const navigateToProfile = (sessionId) => {
    navigate("/profile/" + sessionId)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    fetch("http://127.0.0.1:5000/update_post/" + postId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPostInfo)
    })
    .then(response => response.json())
    .then(data => {
      // console.log("data in submitReg", data)
      if(data.success) {
        setErrors({})
        navigate("/profile/" + sessionId)
      }
      else {
        setErrors(data)
        console.log("errors", data)
      }
    })
    .catch(err => {
      console.log(err)
    })
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
      <div className='pb-3' style={{backgroundImage: `url(${MilkyWay})`, minHeight: "100vh", paddingTop: "150px" }}>
      {loaded && (
        <div className="container-fluid">
          <div style={{ width: "23%", position: 'fixed' }}>
            <SideBarProfile
                userInfo={userInfo}
                sessionId={sessionId}
                navigateToProfile={navigateToProfile}
                numberOfFollowers={loggedInUserFollowers.length}
                numberOfFollows={loggedInUserFollows.length}
                numberOfPosts={loggedInUserPosts.length}
              />
          </div>
          <div className="d-flex justify-content-center">
              <div style={{ width: "65%", marginLeft: "23%" }}>
                <div className='border rounded p-3 mb-3' style={{backgroundColor: "#f2f2f2"}}>
                  {errors.content ? 
                      <p className="text-danger formText">{errors.content}</p>
                      : null
                  }
                  <h6 className='formText'>Edit Post:</h6>
                  <form onSubmit={submitHandler}>
                      <div className="form-group">
                          <textarea
                              className="form-control formText"
                              name="content"
                              value={updatedPostInfo.content}
                              onChange={changeHandler}
                          />
                          <input type="submit" value="Update Post" className="btn mt-2 text-white formText" style={{ fontWeight: 'bold', backgroundColor: "#483D8B" }}/>
                      </div>
                  </form>
                </div>
                <DisplaySinglePost
                  postInfo={postInfo}
                  navigateToProfile={navigateToProfile}
                  userInfo={userInfo}
                  sessionId={sessionId}
                  loggedInUserLikes={loggedInUserLikes}
                  addLike={addLike}
                  removeLike={removeLike}
                  allPosts={loggedInUserPosts}
                  setAllPosts={setLoggedInUserPosts}

                  />
              </div>
          </div>
        </div>
      )
    }
    </div>
    </div>
  )
}

export default EditPost