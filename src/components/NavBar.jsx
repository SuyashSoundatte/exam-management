import React from 'react'
import "./NavBar.css";
import { Outlet, Link } from 'react-router-dom'

function NavBar() {
  return (
    <>
      <nav id="nav">
        {/* <div id="admin">Only for Admin</div> */}
        <Link to={"/"}>
          <p id="home">Home</p>
        </Link>
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
      </nav>
      <Outlet/>
    </>
  )
}

export default NavBar
