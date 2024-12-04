import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AdminMarksEntry from './AdminMarksEntry';
import AddCollegeAndCitites from './AddCollegeAndCitites';

function AdminDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/student/allStudents");
        setStudents(response.data.students);
        console.log(response.data.students);  // Log for debugging purposes
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents(); // Trigger the fetch on component mount
  }, []);

  return (
    <>
      <h1>Admin Dashboard</h1>

      {/* Table to render student data */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>City/Village</th>
            <th>Mobile Number</th>
            <th>WhatsApp Number</th>
            <th>Email</th>
            <th>School Name</th>
            <th>Board</th>
            <th>Medium</th>
            <th>Seat Number</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.firstName}</td>
              <td>{student.middleName}</td>
              <td>{student.lastName}</td>
              <td>{student.gender}</td>
              <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
              <td>{student.address}</td>
              <td>{student.cityOrVillage}</td>
              <td>{student.mobileNumber}</td>
              <td>{student.whatsappNumber}</td>
              <td>{student.email}</td>
              <td>{student.schoolName}</td>
              <td>{student.board}</td>
              <td>{student.medium}</td>
              <td>{student.seatNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AdminMarksEntry/>
      <AddCollegeAndCitites/>
    </>
  );
}

export default AdminDashboard;
