import React from 'react'
// get my image from the public folder
import myImage from '../images/lightSaber.webp'

const Advertisement = () => {
  return (
    <div className='border rounded p-2' style={{width: "100%", backgroundColor: "#f2f2f2"}}>
        <p className=''><strong>Sponsored</strong></p>
        <hr />
        <img src={myImage} alt="Advertisemnt picture" style={{ height: 'auto' }} className='rounded img-fluid'/>
        <div className="d-flex justify-content-around mt-3">
            <h6>NSabers</h6>
            <a href="https://www.nsabers.com/" target="_blank">NSabers.com</a>
        </div>
        <hr />
        <p>Get Neopixel Lightsabers at Nsabers. Unleash your inner Jedi with custom designs and immersive effects for epic entertainment.</p>
    </div>
  )
}

export default Advertisement