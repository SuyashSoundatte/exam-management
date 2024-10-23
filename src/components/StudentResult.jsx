import React, { useState } from 'react';
import axios from 'axios';
import './StudentResult.css'; // Optional: Add your custom CSS for styling

const StudentResultView = () => {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await axios.post('/api/student/result', { email, dob });
      setResult(response.data.result); // Set the result in the state
    } catch (error) {
      // Handle errors (e.g., student not found)
      setError(error.response?.data?.message || 'Error retrieving result');
    }
  };

  return (
    <div className="student-result-view">
      <h2>View Your Exam Result</h2>
      <form onSubmit={handleSubmit} className="result-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth (YYYY-MM-DD):</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Enter your date of birth"
            required
          />
        </div>

        <button type="submit">View Result</button>
      </form>

      {/* Display the result or an error message */}
      {result && (
        <div className="result">
          <h3>Your Result:</h3>
          <p>{result}</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default StudentResultView;
