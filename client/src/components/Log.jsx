import React, {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import Cookies from 'js-cookie';


const Log = (props) => {
    const {sessionId, setSessionId} = props
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    console.log("session id: ", sessionId)

    // do something that if session id still exists remove it

    const changeHandler = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }
    const submitLog = (e) => {
    e.preventDefault()
    fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    })
    .then(response => response.json())
    .then(data => {
        console.log("data in submitLogin", data)
        if (data.success) {
            setUserInfo({
                email: "",
                password: ""
            })
            setErrors({})
            setSessionId(data.user.id)
            navigate("/dashboard/" + data.user.id)
        } else {
            setErrors(data.message)
        }
    })
    .catch(err => {
        console.log(err)
        console.log("Network error")
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
                    <p>
                        {errors}
                    </p>
                </div>
            : null
            }
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Login</h2>
                    <form onSubmit={submitLog}>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" name="email" className="form-control" onChange={changeHandler} value={userInfo.email}/>
                            <span className="text-danger">{errors.email ? errors.email.message : ""}</span>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" className="form-control" onChange={changeHandler} value={userInfo.password}/>
                            <span className="text-danger">{errors.password ? errors.password.message : ""}</span>
                        </div>
                        <input type="submit" value="Login" className="btn btn-primary"/>
                    </form>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Log