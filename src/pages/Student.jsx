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
    medium: "",
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
        const response = await fetch(
          "http://localhost:3000/admin/allColleges",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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
        throw new Error(errorData.message || "Error registering student");
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
        medium: "",
      });
    } catch (error) {
      console.error("Error during registration: ", error.message);
      toast.error("Error: " + error.message); // Notify the user on error
    }
  };

  return (
    <div
      className="main h-screen w-screen bg-[#F0F0F0] flex flex-col md:flex-row"
    >
      {/* Left Section */}
      <div className="left h-full md:h-full w-full md:w-1/2 flex items-center justify-center bg-blue-100">
        <h1 className="text-lg md:text-3xl font-bold text-gray-800">
          INFORMATION
        </h1>
      </div>
  
      {/* Right Section */}
      <div
        className="right h-fit md:h-full w-full md:w-1/2 flex justify-center bg-black"
      >
        <form
          onSubmit={handleSubmit}
          className="form h-fit w-11/12 sm:w-2/3 bg-white px-6 py-8 rounded-lg mt-6 md:mt-40 shadow-lg"
        >
          {/* Name Fields */}
          <div className="inputField flex flex-col sm:flex-row gap-2">
            {/* First Name */}
            <div className="form-group mb-4 w-full">
              <input
                placeholder="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />
            </div>
  
            {/* Middle Name */}
            <div className="form-group mb-4 w-full">
              <input
                placeholder="Middle Name"
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />
            </div>
  
            {/* Last Name */}
            <div className="form-group mb-4 w-full">
              <input
                placeholder="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>
  
          {/* Select Fields */}
          <div className="inputField flex flex-col sm:flex-row gap-2">
            {/* Gender */}
            <div className="form-group mb-4 w-full">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
  
            {/* Date of Birth */}
            <div className="form-group mb-4 w-full">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />
            </div>
  
            {/* City or Village */}
            <div className="form-group mb-4 w-full">
              <select
                name="cityOrVillage"
                value={formData.cityOrVillage}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
              >
                <option value="">City</option>
                {cities.map((city) => (
                  <option key={city._id} value={city.cityName}>
                    {city.cityName}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Address */}
          <div className="form-group mb-4">
            <input
              placeholder="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />
          </div>
  
          {/* Contact Fields */}
          <div className="inputField flex flex-col sm:flex-row gap-2">
            {/* Mobile Number */}
            <div className="form-group mb-4 w-full">
              <input
                placeholder="Mobile Number"
                type="text"
                name="mobileNumber"
                pattern="\d{10}"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />
            </div>
  
            {/* WhatsApp Number */}
            <div className="form-group mb-4 w-full">
              <input
                placeholder="WhatsApp Number"
                type="text"
                name="whatsappNumber"
                pattern="\d{10}"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>
  
          {/* Email */}
          <div className="form-group mb-4">
            <input
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />
          </div>
  
          {/* Academic Details */}
          <div className="inputField flex flex-col sm:flex-row gap-2">
            {/* College Name */}
            <div className="form-group mb-4 w-full">
              <select
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
              >
                <option value="">College</option>
                {schools.map((school) => (
                  <option key={school._id} value={school.collegeName}>
                    {school.collegeName}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Board */}
            <div className="form-group mb-4 w-full">
              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
              >
                <option value="">Board</option>
                <option value="SSC">SSC</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="OLYMPIAD">OLYMPIAD</option>
              </select>
            </div>
  
            {/* Medium */}
            <div className="form-group mb-4 w-full">
              <select
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
              >
                <option value="">Medium</option>
                <option value="Marathi">Marathi</option>
                <option value="Semi-English">Semi-English</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );  
};

export default Student;
