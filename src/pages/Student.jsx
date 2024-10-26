import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

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
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>User Registration Form</h2>

      {/* First Name */}
      <div className="form-group">
        <label>First Name:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>

      {/* Middle Name */}
      <div className="form-group">
        <label>Middle Name:</label>
        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
      </div>

      {/* Last Name */}
      <div className="form-group">
        <label>Last Name:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>

      {/* Gender */}
      <div className="form-group">
        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label>Date of Birth (YYYY-MM-DD):</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
      </div>

      {/* Address */}
      <div className="form-group">
        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </div>

      {/* City or Village */}
      <div className="form-group">
        <label>City or Village:</label>
        <select name="cityOrVillage" value={formData.cityOrVillage} onChange={handleChange} required>
          <option value="">Select</option>
          {cities.map((city) => (
            <option key={city._id} value={city.cityName}>{city.cityName}</option>
          ))}
        </select>
      </div>

      {/* Mobile Number */}
      <div className="form-group">
        <label>Mobile Number:</label>
        <input type="text" name="mobileNumber" pattern="\d{10}" value={formData.mobileNumber} onChange={handleChange} required />
      </div>

      {/* WhatsApp Number */}
      <div className="form-group">
        <label>WhatsApp Number:</label>
        <input type="text" name="whatsappNumber" pattern="\d{10}" value={formData.whatsappNumber} onChange={handleChange} required />
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      {/* College Name */}
      <div className="form-group">
        <label>College Name:</label>
        <select name="schoolName" value={formData.schoolName} onChange={handleChange} required>
          <option value="">Select</option>
          {schools.map((school) => (
            <option key={school._id} value={school.collegeName}>
              {school.collegeName}
            </option>
          ))}
        </select>
      </div>

      {/* Board */}
      <div className="form-group">
        <label>Board:</label>
        <select name="board" value={formData.board} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="SSC">SSC</option>
          <option value="CBSE">CBSE</option>
          <option value="ICSE">ICSE</option>
          <option value="OLYMPIAD">OLYMPIAD</option>
        </select>
      </div>

      {/* Medium */}
      <div className="form-group">
        <label>Medium:</label>
        <select name="medium" value={formData.medium} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Marathi">Marathi</option>
          <option value="Semi-English">Semi-English</option>
          <option value="English">English</option>
        </select>
      </div>

      <button type="submit">Submit</button>
      <ToastContainer />
    </form>
  );
};

export default Student;
