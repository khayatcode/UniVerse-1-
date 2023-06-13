import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Reg from './components/Reg';
import Log from './components/Log';
import Dashboard from './views/Dashboard';
import Profile from './views/Profile';


function App() {
  // I want to see if my python back end is sending data to my react front end

  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Reg />} />
        <Route path="/login" element={<Log />} />
        <Route path="/dashboard/:userId" element={<Dashboard/>} />
        <Route path="/profile/:userId" element={<Profile/>} />
      </Routes>
    </div>
  );
}


export default App;
