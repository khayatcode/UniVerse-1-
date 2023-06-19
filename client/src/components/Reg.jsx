import React, { useState } from 'react'
import {useNavigate, Link} from 'react-router-dom'

// Create a Registration Form Component using Bootstrap that will allow users to put in their first_name, last_name, user_name, location, occupation, email, password, and confirm_password. 
// The form should have a submit button that will send the data to the server.
// The form should have a link to the Login page.

const Reg = (props) => {
    const {sessionId, setSessionId} = props
    const [userInfo, setUserInfo] = useState({
        id: "",
        first_name: "",
        last_name: "",
        user_name: "",
        profile_pic: null,
        location: "",
        occupation: "",
        email: "",
        password: "",
        confirm_password: ""
    }
    )
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const changeHandler = (e) => {
        if (e.target.name === "profile_pic") {
            setUserInfo({
                ...userInfo,
                profile_pic: e.target.files[0]
            });
        } else {
            setUserInfo({
                ...userInfo,
                [e.target.name]: e.target.value
            });
        }
    };

const submitReg = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('first_name', userInfo.first_name)
    formData.append('last_name', userInfo.last_name)
    formData.append('user_name', userInfo.user_name)
    formData.append('location', userInfo.location)
    formData.append('occupation', userInfo.occupation)
    formData.append('email', userInfo.email)
    formData.append('password', userInfo.password)
    formData.append('confirm_password', userInfo.confirm_password)
    formData.append('profile_pic', userInfo.profile_pic)

    fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("data in submitReg", data)
        console.log("session id: ", data.user_id)
        if (data.success) {
            setUserInfo({
                id: "",
                first_name: "",
                last_name: "",
                user_name: "",
                profile_pic: null,
                location: "",
                occupation: "",
                email: "",
                password: "",
                confirm_password: ""

            })
            setErrors({})
            setSessionId(data.user_id)
            // console.log("User has been registered")
            navigate("/dashboard/" + data.user_id)
            // Display success message here
        } else {
            setErrors(data)
        }
    })
    .catch(err => {
        console.log(err)
        console.log("Console error")
    })
}


  return (
    <div>
        <div className="row p-2 text-centre">
            <h1>UniVerse</h1>
        </div>
        <div className="bg-light d-flex justify-content-center align-items-center p-3">
            {Object.keys(errors).length > 0 ?
                <div className="alert alert-danger row" role="alert">
                {Object.values(errors).map((error, index) => (
                    <p key={index}>{error}</p>
                ))}
                </div>
            : null
            }
            <div className='col-6 row bg-white rounded'>
                <form onSubmit={submitReg}>
                    <div className="row p-2">
                        <div className="col-3">
                            <div className="form-floating">
                                <input type="text" className="form-control" name="first_name" id="first_name" onChange={changeHandler} placeholder="First Name"/>
                                <label htmlFor="first_name">First Name</label>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="form-floating">
                                <input type="text" className="form-control" name="last_name" id="last_name" onChange={changeHandler}/>
                                <label htmlFor="last_name">Last Name</label>
                            </div>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <div className="form-floating">
                                <input type="text" className="form-control" name="user_name" id="user_name" onChange={changeHandler}/>
                                <label htmlFor="user_name">User Name</label>
                            </div>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <div className="form-floating">
                                <input type="text" className="form-control" name="location" id="location" onChange={changeHandler}/>
                                <label htmlFor="location">Location</label>
                            </div>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <div className="form-floating">
                                <input type="text" className="form-control" name="occupation" id="occupation" onChange={changeHandler}/>
                                <label htmlFor="occupation">Occupation</label>
                            </div>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <div className="form-floating">
                                <input type="text" className="form-control" name="email" id="email" onChange={changeHandler}/>
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-2">
                            <div className="form-floating">
                                <input type="password" className="form-control" name="password" id="password" onChange={changeHandler}/>
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-floating">
                                <input type="password" className="form-control" name="confirm_password" id="confirm_password" onChange={changeHandler}/>
                                <label htmlFor="confirm_password">Confirm Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <div className="">
                                <input type="file" className="form-control-file" name="profile_pic" id="profile_pic" onChange={changeHandler}/>
                                <label htmlFor="profile_pic">Profile Picture</label>
                            </div>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <input type="submit" className="btn btn-primary" value="Register"/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <Link to="/login">Already have an account? Login here.</Link>
                        </div>
                    </div>
                </form>         
            </div>
        </div>
    </div>
  )
}

export default Reg