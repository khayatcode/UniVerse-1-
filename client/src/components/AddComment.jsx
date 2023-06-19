import React from 'react'
import { useState } from 'react'

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
        fetch(`http://127.0.0.1:5000/create_comment`, {
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
        <div className='border rounded p-2'>
            <p>Create Comment:</p>
            {errors.description ? <p className="text-danger">{errors.description}</p> : null}
            <form onSubmit={submitCommentHandler}>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        rows="3"
                        name="description"
                        value={comment.description}
                        onChange={changeHandler}
                        placeholder="What's on your mind?">
                    </textarea>
                    <input type="hidden" name="user_id" value={sessionId} />
                    <input type="hidden" name="post_id" value={postId} />
                </div>
                <input type="submit" value="Create Comment" className="btn btn-primary" />
            </form>


        </div>
    </div>
  )
}

export default AddComment