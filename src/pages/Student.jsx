import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./Student.css"
const Student = () => {
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    cityOrVillage: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    schoolName: "",
    board: "",
    medium: ""
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/allCities", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }

        const data = await response.json();
        setCities(data || []); // Assuming data is already in the desired format
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

    const fetchColleges = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/allColleges", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch colleges");
        }

        const data = await response.json();
        console.log(data);
        setSchools(data.schools || []); // Ensure schools is an array
        console.log(data.schools);
      } catch (error) {
        console.error(error);
        setError(error.message); // Set the error message
      }
    };

    fetchCities();
    fetchColleges();
  }, []);

  // Render error message if there is one
  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/student/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error registering student');
      }

      const data = await response.json();
      console.log("Registration Successful: ", data.message);
      toast("Student Registered Successfully"); // Notify the user on success

      // Reset the form
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        cityOrVillage: "",
        mobileNumber: "",
        whatsappNumber: "",
        email: "",
        schoolName: "",
        board: "",
        medium: ""
      });

    } catch (error) {
      console.error("Error during registration: ", error.message);
      toast.error("Error: " + error.message); // Notify the user on error
    }
  };
  return (
    <>
      {/* Main Content */}
      <div id="p1-overlay">
        <div id="page1">
          <div className="left">
            <div className="left-lcontent">
              <h3>Fueling Futures, Empowering Dreams</h3>
              <h1>DKTE's</h1>
              <h2>IIT and Medical Academy</h2>
              <h4>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Delectus, obcaecati. Ipsam nihil sequi dignissimos. Architecto
                necessitatibus doloribus dolor odio.
              </h4>
            </div>
            <div className="left-rcontent">
              <img src="./img/scholars-image.webp" alt="Scholars" />
            </div>
          </div>
  
          <div className="right">
            {/* Registration Form */}
            <form id="form" onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div className="header">
                <h1>DKTE EXAM REGISTRATION</h1>
              </div>
  
              {/* First Name, Middle Name, and Last Name */}
              <div className="subdiv">
                <input name="firstName" className="fname" type="text" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                <input name="middleName" className="mname" type="text" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" required />
                <input name="lastName" className="lname" type="text" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
              </div>
  
              {/* Gender and Date of Birth */}
              <div className="subdiv">
                <select name="gender" className="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
  
                <input name="dateOfBirth" type="date" className="dob" value={formData.dateOfBirth} onChange={handleChange} required />
              </div>
  
              {/* Address and City or Village */}
              <div className="subdiv">
                <input name="address" className="add" type="text" value={formData.address} onChange={handleChange} placeholder="Address" required />
                <select name="cityOrVillage" className="city" value={formData.cityOrVillage} onChange={handleChange} required>
                  <option value="">City or Village</option>
                  <option value="City A">City A</option>
                  <option value="Village B">Village B</option>
                  {/* Add more cities/villages as needed */}
                </select>
              </div>
  
              {/* Mobile and WhatsApp Numbers */}
              <div className="subdiv">
                <input name="mobileNumber" className="mob" type="tel" pattern="\d{10}" value={formData.mobileNumber} onChange={handleChange} placeholder="Mobile" required />
                <input name="whatsappNumber" className="whatsapp" type="tel" pattern="\d{10}" value={formData.whatsappNumber} onChange={handleChange} placeholder="WhatsApp" required />
              </div>
  
              {/* Email and School Name */}
              <div className="subdiv">
                <input name="email" className="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <select name="schoolName" className="school" value={formData.schoolName} onChange={handleChange} required>
                  <option value="">School Name</option>
                  <option value="School A">School A</option>
                  <option value="School B">School B</option>
                  {/* Add more school names as needed */}
                </select>
              </div>
  
              {/* Board and Medium */}
              <div className="subdiv">
                <select name="board" className="board" value={formData.board} onChange={handleChange} required>
                  <option value="">Board</option>
                  <option value="SSC">SSC</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="OLYMPIAD">OLYMPIAD</option>
                </select>
  
                <select name="medium" className="medium" value={formData.medium} onChange={handleChange} required>
                  <option value="">Medium</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Semi-English">Semi-English</option>
                  <option value="English">English</option>
                </select>
              </div>
  
              {/* Submit Button */}
              <div className="subdiv btndiv">
                <button className="register" type="submit">Register</button>
              </div>
  
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default Student;
