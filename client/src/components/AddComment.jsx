import React from 'react'
import { useState } from 'react'
import "../styles/CreatePost.css"

const AddComment = (props) => {
    const {postId, sessionId, loggedInUserData, addCommentToPost} = props

    const [comment, setComment] = useState({
        id: "",
        description: "",
        user_id: sessionId,
        post_id: postId,
        creator: loggedInUserData
    })
    const [errors, setErrors] = useState({})

    const changeHandler = (e) => {
        setComment({
            ...comment,
            [e.target.name]: e.target.value
        })
    }

    const submitCommentHandler = (e) => {
        e.preventDefault()
        fetch(`/create_comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(comment)
        })
        .then(response => response.json())
        .then(data => {
            console.log("data in submitComment", data)
            if (data.success) {
                console.log("Comment has been created")
                const newComment = {
                    ...comment,
                    id: data.comment.id
                }
                addCommentToPost(newComment)
                setComment({
                    id: "",
                    description: "",
                    user_id: sessionId,
                    post_id: postId,
                    creator: loggedInUserData
                })
                // scroll to the bottom of the page
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                })
            }
            else {
                setErrors(data)
            }
        })
        .catch(err => {
            console.log(err)
            console.log("There was an error creating the Comment")
        })
    }


  return (
    <div>
        <div className='border rounded p-3' style={{backgroundColor: "#f2f2f2"}}>
            {errors.description ? <p className="text-danger formText">{errors.description}</p> : null}
            <p className='text-start formText'>Add Comment:</p>
            <form onSubmit={submitCommentHandler}>
                <div className="form-group">
                    <textarea
                        className="form-control formText"
                        rows="3"
                        name="description"
                        value={comment.description}
                        onChange={changeHandler}
                        placeholder="What's on your mind?">
                    </textarea>
                    <input type="hidden" name="user_id" value={sessionId} />
                    <input type="hidden" name="post_id" value={postId} />
                </div>
                <input type="submit" value="Comment" className="btn mt-3 col-3 text-white formText" style={{ fontWeight: 'bold', backgroundColor: "#483D8B" }} />
            </form>


        </div>
    </div>
  )
}

export default AddComment