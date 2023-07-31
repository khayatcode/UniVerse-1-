import React from 'react'
import DeleteComment from './DeleteComment';
import "../styles/AllComments.css"

const AllComments = (props) => {
    const {allComments, sessionId, removeComment} = props
  return (
    // Fix comment spacing
    <div>
        <div className="card mt-3">
            <div className="card-body" style={{backgroundColor: "#f2f2f2"}}>
                <h3 className='commentTitle'>
                    {allComments.length == 0 ? "No Comments": `${allComments.length} Comments`}
                </h3>
                <hr />
                <div className='d-flex flex-column' style={{height: "200px", overflowY: "scroll"}}>
                {allComments.map((comment, index) => {
                    return (
                        <div key={index}>
                            <div className='d-flex gap-3 justify-content-start align-items-center'>
                                <img src={comment.creator.profile_pic} alt={comment.creator.user_name} className='commentUserPic' style={{ borderRadius: "50%" }} />
                                <h6 className="card-subtitle commentUserProfile"><strong><em>{comment.creator.user_name}</em></strong></h6>
                                
                            </div>
                            <div className='d-flex justify-content-around align-item-center mt-3 gap-3'>
                                <p className="card-text text-start commentUserText">{comment.description}</p>
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
    </div>
  )
}

export default AllComments