import React from 'react'
import DeleteComment from './DeleteComment';

const AllComments = (props) => {
    const {allComments, sessionId, removeComment} = props
  return (
    <div>
        <div className="card">
            <div className="card-body">
                {allComments.map((comment, index) => {
                    return (
                    <div key={index}>
                        <h5 className="card-title">Commented by: {comment.creator.user_name}</h5>
                        <p className="card-text">{comment.description}</p>
                        {comment.user_id == sessionId ?
                        <div>
                            <DeleteComment 
                            successCallback={() => removeComment(comment.id)}
                            commentId={comment.id}
                            />
                        </div>
                        : null}
                    </div>
                    )
                })}
            </div> 
        </div>
    </div>
  )
}

export default AllComments