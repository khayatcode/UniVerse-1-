import React from 'react'
import { useEffect, useState } from 'react'

const AddFollow = ({ sessionId, post, loggedInUserFollows, removeFollow , addFollow}) => {

    // console.log("post creator id", post.creator.id)
    

    const submitAddFollowHandler = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/follow_user", {
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
            console.log("data in submitFollow", data)
            if (data.success) {
                console.log("Follow has been added")
                // This is where the problem is at
                addFollow(data.follow)
            }
        })
        .catch(err => {
            console.log(err)
            console.log("There was an error adding the Follow")
        })
    }

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
        <div>
            {post.user_id != sessionId ?
                (loggedInUserFollows.find(follow => follow.id == post.user_id) ?
                    <form onSubmit={submitDeleteFollowHandler}>
                        <input type="hidden" name="user_id" value={sessionId}/>
                        <input type="hidden" name="follow_id" value={post.user_id}/>
                        <input type="submit" value="UnFollow" className="btn btn-outline-danger" style={{ fontWeight: 'bold' }}/>
                    </form>
                    :
                    <form onSubmit={submitAddFollowHandler}>
                        <input type="hidden" name="user_id" value={sessionId}/>
                        <input type="hidden" name="follow_id" value={post.user_id}/>
                        <input type="submit" value="Follow" className="btn btn-outline-primary" style={{ fontWeight: 'bold' }}/>
                    </form>)
                : null}
        </div>
    )
}

export default AddFollow