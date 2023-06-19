import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar'
import SideBarProfile from './SideBarProfile'
import DisplaySinglePost from './DisplaySinglePost';
import Cookies from 'js-cookie';

const EditPost = (props) => {
  const {sessionId, setSessionId} = props
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({})
  const [postInfo, setPostInfo] = useState({})
  const [userInfo, setUserInfo] = useState({})
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
      fetch(`http://127.0.0.1:5000/get_one_post/${postId}`)
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
      const [userInfo, postInfo] = data;
      setUserInfo(userInfo);
      setPostInfo(postInfo);
      setUpdatedPostInfo(postInfo);
      setLoaded(true);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

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






  return (
    <div>
      <NavBar 
            sessionId={sessionId}
            navigateToProfile={navigateToProfile}
            setSessionId={setSessionId}
        />
      {loaded && (
        <div className="container">
          <div className="row">
            <div className="col-3">
              <SideBarProfile
                userInfo={userInfo}
                sessionId={sessionId}
                navigateToProfile={navigateToProfile}
              />
            </div>
            <div className="col-9">
              <div className='border rounded p-2'>
                <p>Edit Post:</p>
                {errors.content ? 
                    <p className="text-danger">{errors.content}</p>
                    : null
                }
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            name="content"
                            value={updatedPostInfo.content}
                            onChange={changeHandler}
                        />
                        <input type="submit" value="Update Post" className="btn btn-primary mt-2" />
                    </div>
                </form>
              </div>
              <DisplaySinglePost
                postInfo={postInfo}
                navigateToProfile={navigateToProfile}
                userInfo={userInfo}
                sessionId={sessionId}
                />
            </div>
          </div>
        </div>
      )
        }
    </div>
  )
}

export default EditPost