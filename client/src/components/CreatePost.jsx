import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const CreatePost = (props) => {
    const {sessionId, allPosts, setAllPosts, userInfo} = props
    const [postInfo, setPostInfo] = useState({
        id: "",
        content : "",
        post_pic : null,
        user_id : sessionId,
        creator: userInfo,
        likes : 0
    })
    // do a useEffect to set the userInfo to the creator in the postInfo
    useEffect(() => {
        setPostInfo({
            ...postInfo,
            creator: userInfo
        })
    }, [userInfo])

    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('content', postInfo.content)
        formData.append('post_pic', postInfo.post_pic)
        formData.append('likes', postInfo.likes)
        formData.append('user_id', postInfo.user_id)
        formData.append('creator', postInfo.creator)
        fetch("http://127.0.0.1:5000/create_post", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("data in submitPost", data.post)
            if (data.success) {
                const newPost = {
                    ...postInfo,
                    id: data.post.id,
                    post_pic: data.post.post_pic,
                }
                setAllPosts([newPost, ...allPosts])
                setPostInfo({
                    id: "",
                    content : "",
                    post_pic : null,
                    likes : 0,
                    user_id : sessionId,
                    creator: userInfo
                })

                setErrors({})
                console.log("Post has been created")
                navigate("/dashboard/" + sessionId)
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
    <div className='border rounded p-3' style={{backgroundColor: "#f2f2f2"}}>
        {errors.content ? 
            <p className="text-danger">{errors.content}</p>
            : null
        }
        <p className='text-start'>Create a post:</p>
        <div>
            <form onSubmit={submitHandler}>
                <div className="form-group text-start">
                    <textarea className="form-control" name="content" value={postInfo.content} onChange={(e) => setPostInfo({...postInfo, content: e.target.value})} placeholder="What's on your mind?"></textarea>
                    <label htmlFor="post_pic" className="form-label mt-3">Upload a picture:</label>
                    <input type="file" className="form-control" name="post_pic" onChange={(e) => setPostInfo({...postInfo, post_pic: e.target.files[0]})} />
                </div>
                    <input type="hidden" name="likes" value={postInfo.likes} />
                    <input type="hidden" name="user_id" value={postInfo.user_id} />
                    <input type="hidden" name="creator" value={userInfo} />
                    <input type="hidden" name="likes" value={postInfo.likes} />
                    <input type="submit" value="Post" className="btn mt-3 col-2 text-white" style={{ fontWeight: 'bold', backgroundColor: "#483D8B" }} />
            </form>
        </div>
    </div>
  )
}

export default CreatePost