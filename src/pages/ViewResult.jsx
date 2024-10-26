import React, { useEffect, useState } from 'react';

function ViewResult() {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [resultData, setResultData] = useState(null); // State to store the result data

  const handleResult = async () => {
    try {
      const response = await fetch('http://localhost:3000/student/viewResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          dob,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch result');
      }

      const data = await response.json();
      setResultData(data); // Set the fetched data in state
      console.log(data); // Debugging purposes

    } catch (error) {
      console.error('Error:', error);
      setResultData({ message: 'Error fetching result' }); // Handle errors
    }
  };

  return (
    <>
      <div>View Result</div>

      <p>Email</p>
      <input
        type="text"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <p>Date of Birth</p>
      <input
        type="date"
        placeholder="Enter Date of Birth"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />

      <button onClick={handleResult}>View Result</button>

      {resultData && <p>{resultData.message}</p>}
      {resultData && <p>Result: {JSON.stringify(resultData.result)}</p>}
    </>
  );
}

export default ViewResult;
