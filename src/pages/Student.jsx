import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import StudentPage2 from "./StudentPage2";
// import SuccessWindow from "../components/successfullyWindow";
import './style.css'

const Student = () => {
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState(null);
  // const [isSuccessWindow, setSuccessWindow] = useState(false);

  // const openSuccessWindow = ()=> {
  //   setSuccessWindow(true);
  // };

  // const closeSuccessWindow = () => { 
  //   setSuccessWindow(false);
  // };

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
  
    // Manually format date to dd-mm-yyyy
    const formattedDateOfBirth = new Date(formData.dateOfBirth)
      .toLocaleDateString("en-GB")  // This will give dd/mm/yyyy format
      .replace(/\//g, "-");  // Replace slashes with dashes to match dd-mm-yyyy
  
    const updatedFormData = {
      ...formData,
      dateOfBirth: formattedDateOfBirth,  // Set the formatted date of birth
    };
  
    try {
      const response = await fetch("http://localhost:3000/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert("Can not Register !!")
        throw new Error(errorData.message || "Error registering student");
      }
  
      const data = await response.json();
      toast.success("Student Registered Successfully");
  
      // Reset form
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
    } catch (err) {
      console.error("Registration Error:", err.message);
      toast.error(`Error: ${err.message}`);
    }
  };
  
  
  
  return (
    <div className="main bg-[#f0f0f0] h-full w-full">
      {/* page 1 */}
      <div className="page1 h-fit w-full bg-[#F0F0F0] flex flex-col md:flex-row mb-8">
      {/* Left Section */}
      <div className="left h-full md:h-full w-full md:w-1/2 sm:flex items-center justify-center px-6 py-24 sm:px-24 sm:py-52">
        {/* <h1 className="text-lg md:text-3xl font-bold text-gray-800">
          
        </h1> */}
        <div className="left-part1 h-full w-full">
          <h1
          className="md:text-6xl text-6xl font-bold mb-4 font-[Archivo Black]">DKTE'S  <br /> ENTRANCE <br />EXAM</h1>
          <h3
          className="sm:text-2xl text-3xl font-medium mb-2 sm:mb-10 font-[Montserrat]">Unlocking a World <br /> of Opportunities</h3>
          <h5 className="md:w-3/5 text-base font-medium font-[Montserrat]">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis, laboriosam nihil. Accusantium eaque reprehenderit est saepe vero fugiat quas sapiente?</h5>
        </div>
        {/* <div className="left-part2 h-full w-1/2 bg-slate-600">

        </div> */}
      </div>
  
      {/* Right Section */}
      <div
        className="right h-fit md:h-full w-full md:w-1/2 flex justify-center"
      >
        
        <form
          onSubmit={handleSubmit}
          className="form h-fit w-11/12 sm:w-[65%] bg-white px-6 py-8 rounded-lg mt-6 md:ml-[10%] md:mt-[30%]  shadow-lg "
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
  
            {/* City or Village */}
            <div className="form-group mb-4 w-full">
            <select
                name="cityOrVillage"
                value={formData.cityOrVillage}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">City</option>
                <option value="">Miraj</option>
                <option value="Male">Sangli</option>
                <option value="Female">Dubai</option>
                <option value="Other">Other</option>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
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
            onClick={ () =>{
              handleSubmit();
            }}
            type="submit"
            className="w-full bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-600"
          >
            Submit
          </button>
        </form>
      </div>
      </div>
      <div className="page2 h-screen w-full bg-[#F0F0F0]">
        <StudentPage2/>
      </div>

    </div>
    
  );  
};

export default Student;
