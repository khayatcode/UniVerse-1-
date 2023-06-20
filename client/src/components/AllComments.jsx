import React from 'react'
import DeleteComment from './DeleteComment';

const AllComments = (props) => {
    const {allComments, sessionId, removeComment} = props
  return (
    <div>
        <div className="card mt-3">
            <div className="card-body" style={{backgroundColor: "#f2f2f2"}}>
                <h3>All Comments</h3>
                <hr />
                {allComments.map((comment, index) => {
                    return (
                        <div>
                            <div className='d-flex gap-3 justify-content-start align-items-center'>
                                <img src={comment.creator.profile_pic} alt={comment.creator.user_name} className='rounded-circle' style={{ width: '50px', height: '50px' }} />
                                <h6 className="card-subtitle"><strong><em>{comment.creator.user_name}</em></strong></h6>
                                
                            </div>
                            <div key={index} className='d-flex justify-content-around align-item-center mt-3'>
                                <p className="card-text text-start">{comment.description}</p>
                                {comment.user_id == sessionId ?
                                <div>
                                    <DeleteComment 
                                    successCallback={() => removeComment(comment.id)}
                                    commentId={comment.id}
                                    />
                                </div>
                                : null}
                            </div>
                            <hr />
                        </div>

                    )
                })}
            </div> 
        </div>
    </div>
  )
}

export default AllComments