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
            {/* <Link to={"/signup"}>
              <p id="signup">SignUp</p>
            </Link> */}
            <Link to={"/student/register"}>
              {/* <p id="student">Student</p> */}
              <button id='student'>Student</button>
            </Link>
            <Link to={"/result"}>
              {/* <p id="result">Result</p> */}
              <button id="result">Result</button>
            </Link>
            <Link to={"/login"}>
              {/* <p id="login" >Login</p> */}
              <button id='login'>Login</button>
            </Link>
        </div>
      </nav>
      <Outlet/>
    </>
  )
}

export default NavBar
