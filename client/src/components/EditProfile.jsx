import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'
import Cookies from 'js-cookie';
import Advertisement from './Advertisement';
import MilkyWay from '../images/milkyWay.jpeg'

const EditProfile = (props) => {
    const { sessionId, setSessionId } = props
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
        if (Cookies.get('sessionId') == "") {
            console.log("redirecting to login")
            return navigate('/login')
        }
        fetch(`/get_user/${sessionId}`)
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
        fetch("/update_user/" + sessionId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        })
            .then(response => response.json())
            .then(data => {
                // console.log("data in submitReg", data)
                if (data.success) {
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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);

    return (
        <div>
            <NavBar
                sessionId={sessionId}
                navigateToProfile={navigateToProfile}
                setSessionId={setSessionId}
            />
            <div className='container-fluid' style={{backgroundImage: `url(${MilkyWay})`, minHeight: "100vh", paddingTop: "150px"}}>
                <div className='d-flex justify-content-center align-items-center'>
                    <div className="col-8 row rounded p-3 mb-5" style={{ backgroundColor: '#D3D3D3', marginTop: "5%" }}>
                        <h5 className='mb-3'><strong>Edit Your UniVerse</strong></h5>
                        <form onSubmit={submitHandler}>
                            {Object.keys(errors).length > 0 ?
                                <div>
                                    {Object.values(errors).map((error, index) => (
                                        <p key={index} className='text-danger'>{error}</p>
                                    ))}
                                </div>
                                : null
                            }
                            <div className="form-floating mb-3">
                                <input onChange={changeHandler} type="text" name="first_name" className="form-control" value={userInfo.first_name} placeholder='First Name'/>
                                <label className="form-label">First Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input onChange={changeHandler} type="text" name="last_name" className="form-control" value={userInfo.last_name} placeholder='Lasst Name'/>
                                <label className="form-label">Last Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input onChange={changeHandler} type="text" name="user_name" className="form-control" value={userInfo.user_name} placeholder='User Name'/>
                                <label className="form-label">User Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input onChange={changeHandler} type="text" name="location" className="form-control" value={userInfo.location} placeholder='Location'/>
                                <label className="form-label">Location</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input onChange={changeHandler} type="text" name="occupation" className="form-control" value={userInfo.occupation} placeholder='Occupation'/>
                                <label className="form-label">Occupation</label>
                            </div>
                            <input type="submit" value="Update" className="btn btn-sm text-white" style={{ backgroundColor: '#483D8B', width: "30%" }} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile