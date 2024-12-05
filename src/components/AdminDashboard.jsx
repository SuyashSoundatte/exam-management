import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminMarksEntry from "./AdminMarksEntry";
import AddCollegeAndCitites from "./AddCollegeAndCitites";

function AdminDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/student/allStudents"
        );
        setStudents(response.data.students);
        console.log(response.data.students); // Log for debugging purposes
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents(); // Trigger the fetch on component mount
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8 animate-fade-in">
        Admin Dashboard
      </h1>

      {/* Student Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-6">
        <table className="min-w-full border-collapse border border-gray-200 text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Middle Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Date of Birth</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">City/Village</th>
              <th className="px-4 py-2">Mobile Number</th>
              <th className="px-4 py-2">WhatsApp Number</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">School Name</th>
              <th className="px-4 py-2">Board</th>
              <th className="px-4 py-2">Medium</th>
              <th className="px-4 py-2">Seat Number</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                className={`transition-colors hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-2">{student.firstName}</td>
                <td className="px-4 py-2">{student.middleName}</td>
                <td className="px-4 py-2">{student.lastName}</td>
                <td className="px-4 py-2">{student.gender}</td>
                <td className="px-4 py-2">
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{student.address}</td>
                <td className="px-4 py-2">{student.cityOrVillage}</td>
                <td className="px-4 py-2">{student.mobileNumber}</td>
                <td className="px-4 py-2">{student.whatsappNumber}</td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2">{student.schoolName}</td>
                <td className="px-4 py-2">{student.board}</td>
                <td className="px-4 py-2">{student.medium}</td>
                <td className="px-4 py-2">{student.seatNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Features */}
      <div className="flex justify-center mt-10 space-x-6">
        <AdminMarksEntry />
        <AddCollegeAndCitites />
      </div>
    </div>
  );
}

export default AdminDashboard;
