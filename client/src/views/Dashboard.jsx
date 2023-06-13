import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import SideBarProfile from '../components/SideBarProfile'
import DisplayAllPosts from '../components/DisplayAllPosts'
import Advertisement from '../components/Advertisement'
import CreatePost from '../components/CreatePost'

// Do a welcome page with the person name
const Dashboard = () => {
    const [allPosts, setAllPosts] = useState([])
    const [allFriends, setAllFriends] = useState([])
    const [userInfo, setUserInfo] = useState({
        id: "",
        first_name: "",
        last_name: "",
        user_name: "",
        location: "",
        occupation: "",
        email: ""
    }
    )
    
    const {userId} = useParams()

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/get_user/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log("user info", data)
            setUserInfo(data)
        })
        .catch(err => {
          console.log(err)
          console.log("Get User error")
        })
    }, [])

  // fetch all friends
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get_all_friends/${userId}`)
    .then(response => response.json())
    .then(data => {
        console.log("all friends", data)
        setAllFriends(data)
    })
    .catch(err => {
      console.log(err)
      console.log("Get friends error")
    })
}, [])
  

    useEffect(() => {
      fetch('http://127.0.0.1:5000/get_all_posts_with_creator')
      .then(res => res.json())
      .then(res => {
        setAllPosts(res);
        console.log("all posts", res);
        console.log("successfully fetched data from backend");
      })
      .catch(error => {
        console.error('Error fetching members:', error);
        console.log("failed to fetch data from backend");
        // Handle the error (e.g., display an error message)
      });
}, []);
    
    const removeFromDom = postId => {
        setAllPosts(allPosts.filter(post => post.id !== postId))
    }
        
  return (
    <div>
      <NavBar />
      <div className="d-flex justify-content-around p-5 gap-4">
        <div className="col-3">
          <SideBarProfile userInfo={userInfo} />
        </div>
        <div className="col-6">
          <CreatePost userId={userId} allPosts={allPosts} setAllPosts={setAllPosts} userInfo={userInfo} />
          <DisplayAllPosts allPosts={allPosts} userId={userId} setAllPosts={setAllPosts} removeFromDom={removeFromDom} allFriends={allFriends} setAllFriends={setAllFriends}/>
        </div>
        <div className="col-3">
        <Advertisement/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard