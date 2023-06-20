import React from 'react'
// get my image from the public folder
import myImage from '../images/aveeno.jpg'

const Advertisement = () => {
  return (
    <div className='border rounded p-2' style={{backgroundColor: "#f2f2f2"}}>
        <p><strong>Sponsored for today</strong></p>
        <img src={myImage} alt="Advertisemnt picture" style={{ width: '200px', height: 'auto' }} className='rounded'/>
        <div className="d-flex justify-content-around mt-3">
            <p>Aveeno</p>
            <a href="https://www.aveeno.ca/" target="_blank">aveeno.ca</a>
        </div>
        <p>At Aveeno®, we promote the selection of natural ingredients to bring nourishing solutions to 
            skincare so even the most dry or sensitive skin feels soothed and moisturized
        </p>
    </div>
  )
}

export default Advertisement