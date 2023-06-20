import React from 'react'

const DeleteComment = (props) => {
    const {commentId, successCallback} = props

    const deleteComment = (e) => {
        e.preventDefault()
        fetch(`http://127.0.0.1:5000/delete_comment/${commentId}`, {
            method: "DELETE"
        })
        .then(response => {
            console.log("response in deleteComment", response);
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
        <button className='btn btn-outline-danger btn-sm' onClick={deleteComment}>Remove</button>
    </div>
  )
}

export default DeleteComment