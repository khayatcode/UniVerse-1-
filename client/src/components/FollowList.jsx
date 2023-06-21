import React from 'react'
// import Link
import { Link } from 'react-router-dom'

const FollowList = (props) => {
    const { allFollows, removeFollow, userInfo, sessionId} = props
    const submitDeleteFollowHandler = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/unfollow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: e.target.user_id.value,
                follow_id: e.target.follow_id.value
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("data in submitDeleteFollow", data)
            if (data.success) {
                console.log("Follow has been deleted")
                removeFollow(data.follow.id)

            }
        })
        .catch(err => {
            console.log(err)
            console.log("There was an error deleting the Follow")
        })
    }
    return (
        <div className='border rounded p-3' style={{backgroundColor: "#f2f2f2"}}>
            <h4 className=''>{allFollows.length} Following</h4>
            <hr />
            <div className='d-flex flex-column' style={{height: "150px", overflowY: "scroll"}}>
                {allFollows.length == 0 ?
                    <div className='d-flex justify-content-center align-items-center' style={{height: "100%"}}>
                        <h6 className='text-secondary'>No Follows</h6>
                    </div>
                : 
                allFollows.map((follow, index) => {
                    return (
                        <div key={index}>
                            <div className='d-flex align-items-center mt-3'>
                                <div className='d-flex align-items-center gap-4' style={{marginLeft: "6%"}}>
                                    <img src={follow.profile_pic} alt={follow.user_name} className='rounded-circle' style={{ width: '50px', height: '50px' }} />
                                    <h6>
                                        <Link to={`/profile/${follow.id}`} className='text-decoration-underline text-dark'>{follow.user_name}</Link>
                                    </h6>
                                </div>
                                { userInfo.id == sessionId ?
                                    <div style={{marginLeft: "20%"}}>
                                        <form onSubmit={submitDeleteFollowHandler}>
                                            <input type="hidden" name="user_id" value={sessionId}/>
                                            <input type="hidden" name="follow_id" value={follow.id}/>
                                            <input type="submit" value="UnFollow" className="btn btn-outline-danger btn-sm" style={{ fontWeight: 'bold' }}/>
                                        </form>
                                    </div>
                                : null}
                            </div>
                            <hr />
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}


export default FollowList