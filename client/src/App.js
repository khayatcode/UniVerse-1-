import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  // I want to see if my python back end is sending data to my react front end
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_one_post/2')
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        console.log(res);
        console.log("seucessfully fetched data from backend");
      })
      .catch(error => {
        console.error('Error fetching members:', error);
        console.log("failed to fetch data from backend");
        // Handle the error (e.g., display an error message)
      });
  }, []);

  return (
    <div className="App">

      
    </div>
  );
}


export default App;
