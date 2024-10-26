import React from 'react'
import "./NavBar.css";
import { Outlet, Link } from 'react-router-dom'

function NavBar() {
  return (
    <>
      <nav id="nav">
        {/* <div id="admin">Only for Admin</div> */}
          <div>
            <Link to={"/"}>
              <p id="home">Home</p>
            </Link>
          </div>
          <div>
            <Link to={"/login"}>
              <p id="login" >Login</p>
            </Link>
            <Link to={"/signup"}>
              <p id="signup">SignUp</p>
            </Link>
            <Link to={"/student/register"}>
              <p id="student">Student</p>
            </Link>
            <Link to={"/result"}>
              <p id="result">Result</p>
            </Link>
            <Link to={"/admin"}>
              <p></p>
            </Link>
          </div>
          
      </nav>
      <Outlet/>
    </>
  )
}

export default NavBar
