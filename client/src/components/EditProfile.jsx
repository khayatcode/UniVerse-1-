import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'
import Cookies from 'js-cookie';
import Advertisement from './Advertisement';

const EditProfile = (props) => {
    const {sessionId, setSessionId } = props
    const [loaded, setLoaded] = useState(false);
    const [errors, setErrors] = useState({})
    const [userInfo, setUserInfo] = useState({
        id: "",
        first_name: "",
        last_name: "",
        user_name: "",
        location: "",
        occupation: "",
    }
    )
    const navigate = useNavigate()
    
    const changeHandler = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        const userSession = Cookies.get('sessionId');
        if (!userSession) {
            navigate('/login');
        }
        fetch(`http://127.0.0.1:5000/get_user/${sessionId}`)
        .then(response => response.json())
        .then(data => {
            console.log("data in get_user", data)
            setUserInfo(data)
            setLoaded(true)
        })
        .catch(err => {
            console.log(err)
        })
    }, [sessionId])
    

    const submitHandler = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/update_user/" + sessionId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        })
        .then(response => response.json())
        .then(data => {
            // console.log("data in submitReg", data)
            if(data.success) {
                setUserInfo({
                    id: "",
                    first_name: "",
                    last_name: "",
                    user_name: "",
                    location: "",
                    occupation: ""
                })
                setErrors({})
                navigate("/profile/" + sessionId)
            } else {
                setErrors(data)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    const navigateToProfile = (sessionId) => {
        navigate("/profile/" + sessionId)
    }




  return (
    <div>
        <NavBar
            sessionId={sessionId}
            navigateToProfile={navigateToProfile}
            setSessionId={setSessionId}
        />
        <div className="container">
            <div className="row">
                <div className="col-8">
                    <h1>Edit Profile</h1>
                    <form onSubmit={submitHandler}>
                    {Object.keys(errors).length > 0 ?
                        <div className="alert alert-danger row" role="alert">
                        {Object.values(errors).map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                        </div>
                    : null
                    }
                        <div className="form-group">
                            <label>First Name</label>
                            <input onChange={changeHandler} type="text" name="first_name" className="form-control" value={userInfo.first_name}/>
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input onChange={changeHandler} type="text" name="last_name" className="form-control" value={userInfo.last_name}/>
                        </div>
                        <div className="form-group">
                            <label>User Name</label>
                            <input onChange={changeHandler} type="text" name="user_name" className="form-control" value={userInfo.user_name}/>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input onChange={changeHandler} type="text" name="location" className="form-control" value={userInfo.location}/>
                        </div>
                        <div className="form-group">
                            <label>Occupation</label>
                            <input onChange={changeHandler} type="text" name="occupation" className="form-control" value={userInfo.occupation}/>
                        </div>
                        <input type="submit" value="Update" className="btn btn-primary"/>
                    </form>
                </div>
                <div className="col-4">
                    <Advertisement />
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditProfile