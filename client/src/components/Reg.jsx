import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MilkyWay from '../images/milkyWay.jpeg'


// Create a Registration Form Component using Bootstrap that will allow users to put in their first_name, last_name, user_name, location, occupation, email, password, and confirm_password.
// The form should have a submit button that will send the data to the server.
// The form should have a link to the Login page.

const Reg = (props) => {
    const { sessionId, setSessionId } = props;
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
        confirm_password: "",
    });
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        user_name: "",
        location: "",
        occupation: "",
        email: "",
        password: "",
        confirm_password: ""
    });
    const navigate = useNavigate();

    const changeHandler = (e) => {
        if (e.target.name === "profile_pic") {
            setUserInfo({
                ...userInfo,
                profile_pic: e.target.files[0],
            });
        } else {
            setUserInfo({
                ...userInfo,
                [e.target.name]: e.target.value,
            });
        }
    };

    const submitReg = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("first_name", userInfo.first_name);
        formData.append("last_name", userInfo.last_name);
        formData.append("user_name", userInfo.user_name);
        formData.append("location", userInfo.location);
        formData.append("occupation", userInfo.occupation);
        formData.append("email", userInfo.email);
        formData.append("password", userInfo.password);
        formData.append("confirm_password", userInfo.confirm_password);
        formData.append("profile_pic", userInfo.profile_pic);

        fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data in submitReg", data);
                console.log("session id: ", data.user_id);
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
                        confirm_password: "",
                    });
                    setErrors({});
                    setSessionId(data.user_id);
                    // console.log("User has been registered")
                    navigate("/dashboard/" + data.user_id);
                    // Display success message here
                } else {
                    setErrors(data);
                }
            })
            .catch((err) => {
                console.log(err);
                console.log("Console error");
            });
    };

    return (
        <div>
                <div style={{backgroundImage: `url(${MilkyWay})`, height: "150vh"}}>
                    <h1 className='' style={{ color: "white", backgroundColor: 'transparent', fontWeight: 300, padding: '35px' }}>UniVerse</h1>
                    <div className="d-flex justify-content-center align-items-center" >
                        <div className="col-4 row rounded p-3 mb-3" style={{ backgroundColor: '#f2f2f2' }}>
                            <div className="row mb-3">
                                <div className="col">
                                    <h5><strong>Register Your UniVerse</strong></h5>
                                </div>
                            </div>
                            {Object.keys(errors).length > 0 ? (
                                <div>
                                    {Object.values(errors).map((error, index) => (
                                        <p key={index} className="text-danger">{error}</p>
                                    ))}
                                </div>
                            ) : null}
                            <form onSubmit={submitReg}>
                                <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="first_name"
                                                id="first_name"
                                                onChange={changeHandler}
                                                placeholder="First Name"
                                            />
                                            <label htmlFor="first_name">First Name</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="last_name"
                                                id="last_name"
                                                onChange={changeHandler}
                                                placeholder="Last Name"
                                            />
                                            <label htmlFor="last_name">Last Name</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="user_name"
                                                id="user_name"
                                                onChange={changeHandler}
                                                placeholder="User Name"
                                            />
                                            <label htmlFor="user_name">User Name</label>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="location"
                                                id="location"
                                                onChange={changeHandler}
                                                placeholder="Location"
                                            />
                                            <label htmlFor="location">Location</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="occupation"
                                                id="occupation"
                                                onChange={changeHandler}
                                                placeholder="Occupation"
                                            />
                                            <label htmlFor="occupation">Occupation</label>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="occupation"
                                                id="occupation"
                                                onChange={changeHandler}
                                                placeholder="Occupation"
                                            />
                                            <label htmlFor="occupation">Occupation</label>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="email"
                                                id="email"
                                                onChange={changeHandler}
                                                placeholder="Email"
                                            />
                                            <label htmlFor="email">Email</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                id="password"
                                                onChange={changeHandler}
                                                placeholder="Password"
                                            />
                                            <label htmlFor="password">Password</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="confirm_password"
                                                id="confirm_password"
                                                onChange={changeHandler}
                                                placeholder="Confirm Password"
                                            />
                                            <label htmlFor="confirm_password">Confirm Password</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col text-start">
                                        <label htmlFor="profile_pic" className="form-label">Profile Picture:</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="profile_pic"
                                            id="profile_pic"
                                            onChange={changeHandler}
                                            placeholder="Profile Picture"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3 ">
                                    <input
                                        type="submit"
                                        className="btn text-white col-4 mx-auto"
                                        style={{ backgroundColor: '#483D8B' }}
                                        value="Register"
                                    />
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <Link to="/login" style={{ color: '#483D8B' }}>Already have an account? Login here.</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default Reg;
