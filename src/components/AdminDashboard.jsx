import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [collegesAndCities, setCollegesAndCities] = useState([]);
  const [examSchedule, setExamSchedule] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);

  // Function to get token from localStorage
  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  const handleGetCollegesAndCities = async () => {
    try {
      const token = getToken(); // Get token dynamically
      const response = await axios.get('/api/admin/colleges-cities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollegesAndCities(response.data);
    } catch (error) {
      console.error('Error fetching colleges and cities:', error);
    }
  };

  const handleGetExamSchedule = async () => {
    try {
      const token = getToken(); // Get token dynamically
      const response = await axios.get('/api/admin/exam-schedule', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExamSchedule(response.data);
    } catch (error) {
      console.error('Error fetching exam schedule:', error);
    }
  };

  const handleViewStudents = async () => {
    try {
      const token = getToken(); // Get token dynamically
      const response = await axios.get('/api/admin/view-students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleViewAdmins = async () => {
    try {
      const token = getToken(); // Get token dynamically
      const response = await axios.get('/api/admin/view-admins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-actions">
        <button onClick={handleGetCollegesAndCities}>Get Colleges and Cities</button>
        <button onClick={handleGetExamSchedule}>Get Exam Schedule</button>
        <button onClick={handleViewStudents}>View Registered Students</button>
        <button onClick={handleViewAdmins}>View Registered Admins</button>
        {/* Additional buttons for other admin functionalities */}
      </div>

      <div className="dashboard-results">
        {/* Render the fetched data */}
        <h3>Colleges and Cities:</h3>
        <ul>
          {collegesAndCities.map((item, index) => (
            <li key={index}>{item.name} - {item.city}</li>
          ))}
        </ul>

        <h3>Exam Schedule:</h3>
        <ul>
          {examSchedule.map((schedule, index) => (
            <li key={index}>{schedule.examName}: {schedule.date}</li>
          ))}
        </ul>

        <h3>Registered Students:</h3>
        <ul>
          {students.map((student, index) => ( 
            <li key={index}>{student.name} - Seat No: {student.seatNumber}</li>
          ))}
        </ul>

        <h3>Registered Admins:</h3>
        <ul>
          {admins.map((admin, index) => (
            <li key={index}>{admin.name} - {admin.email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
