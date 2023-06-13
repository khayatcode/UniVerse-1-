import React from 'react'

const DeleteStore = (props) => {
    const {postId, successCallback} = props

    const deletePost = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/delete_post/" + postId, {
            method: "DELETE"
        })
        .then(response => {
            console.log("response in deletePost", response);
            successCallback();
        }
        )
        .catch(err => {
            console.log(err);
            console.log("Console error");
        })
    }
  return (
    <div>
        <button className='btn btn-danger' onClick={deletePost}>Delete {postId}</button>
    </div>
  )
}

export default DeleteStore