import React from 'react';
import './RegistrationForm.css'; // Optional: Separate CSS for the form

const RegistrationForm = () => {
  return (
    <form id="form" method="post" action="http://localhost:3000/student/register">
      <div className="header">
        <h1>DKTE EXAM REGISTRATION</h1>
      </div>
      <div className="subdiv">
        <input name="firstName" className="fname" type="text" placeholder="first name" required />
        <input name="lastName" className="lname" type="text" placeholder="last name" required />
      </div>
      <div className="subdiv">
        <input name="gender" className="gender" type="text" placeholder="Gender" required />
        <input name="dateOfBirth" type="date" className="dob" placeholder="MM/DD/YYYY" />
      </div>
      <div className="subdiv">
        <input name="address" className="add" type="text" placeholder="Address" required />
        <input name="cityOrVillage" className="city" type="text" placeholder="City" required />
      </div>
      <div className="subdiv">
        <input name="mobileNumber" className="mob" type="tel" placeholder="mobile" required />
        <input name="whatsappNumber" className="whatsapp" type="tel" placeholder="whatsapp" required />
      </div>
      <div className="subdiv">
        <input name="email" className="email" type="email" placeholder="email" required />
        <input name="schoolName" className="school" type="text" placeholder="school name" required />
      </div>
      <div className="subdiv">
        <input name="board" className="board" type="text" placeholder="Board" required />
        <input name="medium" className="medium" type="text" placeholder="medium" required />
      </div>
      <div className="subdiv btndiv">
        <button className="register" type="submit">Register</button>
      </div>
    </form>
  );
};

export default RegistrationForm;
