import React from 'react'
import { useEffect, useState } from 'react'

const AddFriend = ({ userId, post, allFriends, setAllFriends }) => {
    const [isFriend, setIsFriend] = useState(false)
    // const [buttonText, setButtonText] = useState("Add Friend")

    console.log("userId", userId)
    console.log("post creator id", post.creator.id)

    useEffect(() => {
        const friend = allFriends.find(friend => friend.friend_id === post.creator.id)
        setIsFriend(friend !== undefined)
        }, [allFriends])

        // useEffect(() => {
        //     if (isFriend) {
        //         setButtonText("Friend Added")
        //     } else {
        //         setButtonText("Add Friend")
        //     }
        // }, [isFriend])

    const submitAddFriendHandler = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/add_friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: e.target.user_id.value,
                friend_id: e.target.friend_id.value
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("data in submitFriend", data)
            if (data.success) {
                console.log("Friend has been added")
                setAllFriends([data.friend, ...allFriends])
            }
        })
        .catch(err => {
            console.log(err)
            console.log("There was an error adding the friend")
        })
    }

    const submitDeleteFriendHandler = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/unfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: e.target.user_id.value,
                friend_id: e.target.friend_id.value
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("data in submitDeleteFriend", data)
            if (data.success) {
                console.log("Friend has been deleted")
                const newFriends = allFriends.filter(friend => friend.friend_id !== post.creator.id)
                setAllFriends(newFriends)
            }
        })
        .catch(err => {
            console.log(err)
            console.log("There was an error deleting the friend")
        })
    }



    return (
        <div>
            {post.creator.id != userId ?
                (!isFriend ?
                    <form onSubmit={submitAddFriendHandler}>
                        <input type="hidden" name="user_id" value={userId}/>
                        <input type="hidden" name="friend_id" value={post.creator.id}/>
                        <input type="submit" value="Add Friend" className="btn btn-primary"/>
                    </form>
                    :
                    <form onSubmit={submitDeleteFriendHandler}>
                        <input type="hidden" name="user_id" value={userId}/>
                        <input type="hidden" name="friend_id" value={post.creator.id}/>
                        <input type="submit" value="UnFriend" className="btn btn-danger"/>
                    </form>
                    )
                : null}
        </div>
    )
}

export default AddFriend