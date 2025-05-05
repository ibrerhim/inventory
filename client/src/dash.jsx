import React from 'react'
import Card from './card'
import SlideNavbar from './SlideInNavbar'
import Logout from './Logout'

function Dash() {
  return (
    <>
    <SlideNavbar />
    <div className="content">
      
      <Card/>
    </div>
    </>

 )
}

export default Dash