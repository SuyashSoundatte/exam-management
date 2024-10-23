import React from 'react';
import './Navbar.css'; // Optional: If you want to style the Navbar separately

const Navbar = () => {
  return (
    <div id="navbar">
      <div className="navleft">
        <img className="dkte-logo" src="./img/dkte-logo_prev_ui.png" alt="DKTE Logo" />
      </div>
      <div className="navright">
        <button className="contact">Contact</button>
      </div>
    </div>
  );
};

export default Navbar;
