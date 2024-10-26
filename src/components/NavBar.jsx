import React from 'react'
import "./NavBar.css"
import { Outlet, Link } from 'react-router-dom'

function NavBar() {
  return (
    <>
      <nav id="nav">
        {/* <div id="admin">Only for Admin</div> */}
        <div className='navLeft'>
          <Link to={"/"}>
            {/* <p id="home">Home</p> */}
            <button id='home'>HOME</button>
          </Link>
        </div>
        <div className='navRight'>
            <Link to={"/student/register"}>
              {/* <p id="student">Student</p> */}
              <button id='student'>Register</button>
            </Link>
            <Link to={"/result"}>
              {/* <p id="result">Result</p> */}
              <button id="result">Result</button>
            </Link>
            <Link to={"/contact"}>
              {/* <p id="login" >Login</p> */}
              <button id='contact'>Contact</button>
            </Link>
            <Link to={"/login"}>
              {/* <p id="login" >Login</p> */}
              <button id='login'>Login</button>
            </Link>
            <Link>
              {/* <p id="login" >Login</p> */}
              <button id='menu'>Menu</button>
            </Link>
        </div>
      </nav>
      <Outlet/>
    </>
  )
}

export default NavBar
