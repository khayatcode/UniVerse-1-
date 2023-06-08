import React, { useState } from 'react'
import {useNavigate, Link} from 'react-router-dom'

// Create a Registration Form Component using Bootstrap that will allow users to put in their first_name, last_name, user_name, location, occupation, email, password, and confirm_password. 
// The form should have a submit button that will send the data to the server.
// The form should have a link to the Login page.

const Reg = () => {
    const [userInfo, setUserInfo] = useState({
        first_name: "",
        last_name: "",
        user_name: "",
        location: "",
        occupation: "",
        email: "",
        password: "",
        confirm_password: ""
    }
    )
    const navigate = useNavigate()

    const submitReg = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        })
        .then(response => 
            response.json())
        .then(data => {
            console.log("data in submitReg", data)
            console.log("User has been registered")
        })
        .catch(err => {
            console.log(err)
            console.log("User has not been registered")
        })
    }

  return (
    <div>
        <div className="row p-2 text-centre">
            <h1>UniVerse</h1>
        </div>
        <div className="bg-light">
            <div>
                <form onSubmit={submitReg}>
                    <div className="row p-2">
                        <div className="col-6">
                            <label htmlFor="first_name">First Name</label>
                            <input type="text" className="form-control" name="first_name" onChange={(e) => setUserInfo({...userInfo, first_name: e.target.value})}/>
                        </div>
                        <div className="col-6">
                            <label htmlFor="last_name">Last Name</label>
                            <input type="text" className="form-control" name="last_name" onChange={(e) => setUserInfo({...userInfo, last_name: e.target.value})}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-10">
                            <label htmlFor="user_name">User Name</label>
                            <input type="text" className="form-control" name="user_name" onChange={(e) => setUserInfo({...userInfo, user_name: e.target.value})}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-10">
                            <label htmlFor="location">Location</label>
                            <input type="text" className="form-control" name="location" onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-10">
                            <label htmlFor="occupation">Occupation</label>
                            <input type="text" className="form-control" name="occupation" onChange={(e) => setUserInfo({...userInfo, occupation: e.target.value})}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-10">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control" name="email" onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-6">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" name="password" onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}/>
                        </div>
                        <div className="col-6">
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <input type="password" className="form-control" name="confirm_password" onChange={(e) => setUserInfo({...userInfo, confirm_password: e.target.value})}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-10">
                            <input type="submit" className="btn btn-primary" value="Register"/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-10">
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