import React from 'react'
// get my image from the public folder
import myImage from '../images/lightSaber.webp'
import '../styles/Advertisement.css'

const Advertisement = () => {
  return (
    <div className='border rounded p-3' style={{ width: "100%", backgroundColor: "#f2f2f2" }}>
      <p className='AdvTitle'><strong>Sponsored</strong></p>
      <hr />
      <img src={myImage} alt="Advertisemnt picture" style={{ height: 'auto' }} className='rounded img-fluid' />
      <div className="d-flex justify-content-around align-items-center mt-3 gap-2">
        <p className='AdvText m-0'>NSabers</p>
        <a href="https://www.nsabers.com/" target="_blank" className='AdvText m-0'>NSabers.com</a>
      </div>
      <hr />
      <p className='AdvText'>Get Neopixel Lightsabers at Nsabers. Unleash your inner Jedi with custom designs and immersive effects for epic entertainment.</p>
    </div>
  )
}

export default Advertisement