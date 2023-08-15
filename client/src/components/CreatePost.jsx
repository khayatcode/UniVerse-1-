import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import "../styles/CreatePost.css"

const CreatePost = (props) => {
    const {sessionId, allPosts, setAllPosts, userInfo, navigateFunction, postRef} = props
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
        formData.append('post_pic', postInfo.post_pic || '')
        formData.append('likes', postInfo.likes)
        formData.append('user_id', postInfo.user_id)
        formData.append('creator', postInfo.creator)
        fetch("/create_post", {
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
                navigateFunction(sessionId)

                // Clear the file input field
                document.querySelector('input[type="file"]').value = ''

                window.scrollTo({
                    top: window.innerHeight / 2.8,
                    behavior: 'smooth'
                });
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
    <div className='border rounded p-3 mb-3' style={{backgroundColor: "#f2f2f2"}}>
        {errors.content ? 
            <p className="text-danger formText">{errors.content}</p>
            : null
        }
        <p className='text-start formText'>Create a post:</p>
        <div>
            <form onSubmit={submitHandler}>
                <div className="form-group text-start">
                    <textarea className="form-control formText" name="content" value={postInfo.content} onChange={(e) => setPostInfo({...postInfo, content: e.target.value})} placeholder="What's on your mind?" ></textarea>
                    <label htmlFor="post_pic" className="form-label mt-3 formText">Upload a picture:</label>
                    <input type="file" className="form-control formText" name="post_pic" onChange={(e) => setPostInfo({...postInfo, post_pic: e.target.files[0]})} />
                </div>
                    <input type="hidden" name="likes" value={postInfo.likes} />
                    <input type="hidden" name="user_id" value={postInfo.user_id} />
                    <input type="hidden" name="creator" value={userInfo} />
                    <input type="hidden" name="likes" value={postInfo.likes} />
                    <input type="submit" value="Post" className="btn mt-3 text-white formText" style={{ fontWeight: 'bold', backgroundColor: "#483D8B" }} />
            </form>
        </div>
    </div>
  )
}

export default CreatePost