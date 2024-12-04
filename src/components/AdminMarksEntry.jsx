import axios from 'axios';
import React, { useEffect, useState } from 'react';

function AdminMarksEntry() {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // State to store marks for each student

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/student/allStudents');
        setStudents(response.data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents(); // Fetch students on component mount
  }, []);

  // Handle input change for marks
  const handleMarksChange = (studentId, value) => {
    setMarks({ ...marks, [studentId]: value });
  };

  // Handle submission of marks
  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/student/submitMarks', { marks });
      alert('Marks submitted successfully!');
    } catch (error) {
      console.error('Error submitting marks:', error);
    }
  };

  return (
    <div>
      <h1>Admin Marks Entry</h1>

      <div style={gridContainer}>
        <div className="grid-header">Student Name</div>
        <div className="grid-header">Seat Number</div>
        <div className="grid-header">Enter Marks</div>

        {students.map((student) => (
          <React.Fragment key={student._id}>
            <div className="grid-cell">{student.firstName} {student.lastName}</div>
            <div className="grid-cell">{student.seatNumber}</div>
            <div className="grid-cell">
              <input
                type="number"
                value={marks[student._id] || ''} // Set the input value
                onChange={(e) => handleMarksChange(student._id, e.target.value)} // Update marks
                placeholder="Enter Marks"
                style={{ width: '100px' }}
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      <button onClick={handleSubmit} style={{ marginTop: '20px' }}>Submit Marks</button>
    </div>
  );
}

const gridContainer = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr',
  gap: '10px',
  padding: '20px',
};

export default AdminMarksEntry;
