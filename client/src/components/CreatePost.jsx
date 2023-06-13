import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const CreatePost = (props) => {
    const {userId, allPosts, setAllPosts, userInfo} = props
    const [postInfo, setPostInfo] = useState({
        id: "",
        content : "",
        likes : 0,
        user_id : userId,
        creator: userInfo
    })
    // do a useEffect to set the userInfo to the creator in the postInfo
    useEffect(() => {
        setPostInfo({
            ...postInfo,
            creator: userInfo
        })
    }, [userInfo])
    console.log("postInfo", postInfo)

    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/create_post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postInfo)
        })
        .then(response => response.json())
        .then(data => {
            console.log("data in submitPost", data.post)
            if (data.success) {
                const newPost = {
                    ...postInfo,
                    id: data.post.id
                }
                setAllPosts([newPost, ...allPosts])
                setPostInfo({
                    id: "",
                    content : "",
                    likes : 0,
                    user_id : userId,
                    creator: userInfo
                })

                setErrors({})
                console.log("Post has been created")
                navigate("/dashboard/" + userId)
            }
            else {
                setErrors(data)
            }
        })
        .catch(err => {
            console.log(err)
            console.log("Console error")
        })
    }

  return (
    <div className='border rounded p-2'>
        <p>Create a post: {userId}</p>
        {errors.content ? 
            <p className="text-danger">{errors.content}</p>
            : null
        }
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <textarea className="form-control" name="content" value={postInfo.content} onChange={(e) => setPostInfo({...postInfo, content: e.target.value})} placeholder="What's on your mind?"></textarea>
                <input type="hidden" name="likes" value={postInfo.likes} />
                <input type="hidden" name="user_id" value={postInfo.user_id} />
                <input type="hidden" name="creator" value={userInfo} />
                <input type="submit" value="Post" className="btn btn-primary" />
            </div>
        </form>
    </div>
  )
}

export default CreatePost