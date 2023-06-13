import React, { useState } from 'react'
import {useNavigate, Link} from 'react-router-dom'

// Create a Registration Form Component using Bootstrap that will allow users to put in their first_name, last_name, user_name, location, occupation, email, password, and confirm_password. 
// The form should have a submit button that will send the data to the server.
// The form should have a link to the Login page.

const Reg = () => {
    const [userInfo, setUserInfo] = useState({
        id: "",
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
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const changeHandler = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }

const submitReg = (e) => {
    e.preventDefault()
    fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInfo)
    })
    .then(response => response.json())
    .then(data => {
        console.log("data in submitReg", data)
        if (data.success) {
            setUserInfo({
                id: "",
                first_name: "",
                last_name: "",
                user_name: "",
                location: "",
                occupation: "",
                email: "",
                password: "",
                confirm_password: ""

            })
            setErrors({})
            console.log("User has been registered")
            navigate("/dashboard/" + data.user.id)
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
                            <label htmlFor="first_name">First Name</label>
                            <input type="text" className="form-control" name="first_name" onChange={changeHandler}/>
                        </div>
                        <div className="col-3">
                            <label htmlFor="last_name">Last Name</label>
                            <input type="text" className="form-control" name="last_name" onChange={changeHandler}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <label htmlFor="user_name">User Name</label>
                            <input type="text" className="form-control" name="user_name" onChange={changeHandler}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <label htmlFor="location">Location</label>
                            <input type="text" className="form-control" name="location" onChange={changeHandler}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <label htmlFor="occupation">Occupation</label>
                            <input type="text" className="form-control" name="occupation" onChange={changeHandler}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-5">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control" name="email" onChange={changeHandler}/>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" name="password" onChange={changeHandler}/>
                        </div>
                        <div className="col-2">
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <input type="password" className="form-control" name="confirm_password" onChange={changeHandler}/>
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