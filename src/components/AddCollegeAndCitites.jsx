import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddCollegeAndCities() {
  const [cities, setCities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [newCollege, setNewCollege] = useState(''); // State for new college

  // Fetch existing cities and colleges on component mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve token from storage
        const response = await axios.get("http://localhost:3000/admin/allColleges", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setColleges(response.data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    const fetchCities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/admin/allCities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchColleges();
    fetchCities();
  }, []);

  // Add a new city
  const addCity = async () => {
    try {
      const token = localStorage.getItem('token');  // Retrieve token

      const res = await axios.post("http://localhost:3000/admin/addCity", {
        cityName: newCity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('City added:', res.data);
      setCities([...cities, res.data]);
      setNewCity('');  // Clear the input field
    } catch (error) {
      console.error('Error adding city:', error);
    }
  };

  // Add a new college
  const addCollege = async () => {
    try {
      const token = localStorage.getItem('token');  // Retrieve token

      const res = await axios.post("http://localhost:3000/admin/addCollege", {
        collegeName: newCollege,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('College added:', res.data);
      setColleges([...colleges, res.data]);
      setNewCollege('');
    } catch (error) {
      console.error('Error adding college:', error);
    }
  };

  return (
    <>
      <h1>Add College and Cities</h1>

      <h2>Colleges</h2>
      {colleges.length > 0 ? (
        colleges.map((college) => (
          <p key={college._id}>{college.collegeName}</p>  // Ensure unique key for colleges
        ))
      ) : (
        <p>No colleges found.</p>
      )}

      <h2>Add a New College</h2>
      <input 
        type="text" 
        value={newCollege} 
        onChange={(e) => setNewCollege(e.target.value)} 
        placeholder="Enter college name" 
      />
      <button onClick={addCollege}>Add College</button>

      <h2>Cities</h2>
      {cities.length > 0 ? (
        cities.map((city) => (
          <p key={city._id}>{city.cityName}</p>  // Ensure unique key for cities
        ))
      ) : (
        <p>No cities found.</p>
      )}

      <h2>Add a New City</h2>
      <input 
        type="text" 
        value={newCity} 
        onChange={(e) => setNewCity(e.target.value)} 
        placeholder="Enter city name" 
      />
      <button onClick={addCity}>Add City</button>
    </>
  );
}

export default AddCollegeAndCities;
