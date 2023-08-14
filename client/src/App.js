import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Reg from './components/Reg';
import Log from './components/Log';
import Dashboard from './views/Dashboard';
import Profile from './views/Profile';
import Cookies from 'js-cookie';
import EditProfile from './components/EditProfile';
import EditPost from './components/EditPost';
import ViewPost from './components/ViewPost';


function App() {
  const [sessionId, setSessionId] = useState(Cookies.get("sessionId") || "");

  useEffect(() => {
    console.log("sessionId changed:", sessionId);
    Cookies.set("sessionId", sessionId);
  }, [sessionId]);

  //  to remove a cookie
  //  Cookies.remove("sessionId");

  // to check if a cookie exists
  // if (Cookies.get("sessionId")) {
  //   console.log("cookie exists");
  // } else {
  //   console.log("cookie does not exist");
  // }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/register" element={<Reg sessionId={sessionId} setSessionId={setSessionId}/>} />
        <Route path="/login" element={<Log sessionId={sessionId} setSessionId={setSessionId}/>} />
        <Route path="/dashboard/:sessionId" element={<Dashboard sessionId={sessionId} setSessionId={setSessionId}/>} />
        <Route path="/profile/:userId" element={<Profile sessionId={sessionId} setSessionId={setSessionId}/>} />
        <Route path="/profile/edit/:sessiodId" element={<EditProfile sessionId={sessionId} setSessionId={setSessionId}/>} />
        <Route path="/post/edit/:postId" element={<EditPost sessionId={sessionId} setSessionId={setSessionId}/>} />
        <Route path="/post/view/:postId/:userId" element={<ViewPost sessionId={sessionId} setSessionId={setSessionId}/>} />
      </Routes>
    </div>
  );
}


export default App;
