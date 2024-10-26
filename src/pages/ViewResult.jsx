import React, { useEffect, useState } from 'react';
import "./ViewResult.css"
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
    // <>
    //   <div>View Result</div>

    //   <p>Email</p>
    //   <input
    //     type="text"
    //     placeholder="Enter Email"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //   />

    //   <p>Date of Birth</p>
    //   <input
    //     type="date"
    //     placeholder="Enter Date of Birth"
    //     value={dob}
    //     onChange={(e) => setDob(e.target.value)}
    //   />

    //   <button onClick={handleResult}>View Result</button>

    //   {resultData && <p>{resultData.message}</p>}
    //   {resultData && <p>Result: {JSON.stringify(resultData.result)}</p>}
    // </>
    <>
  <div id="main">
  <div className="wrapper-left">
    <div className="part-one">
      <h3>View Result</h3>
      <div className="container-left">
        <div className="inp">
          <p>Email</p>
          <input
            type="text"
            className="inp-left"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>Date of Birth</p>
          <input
            type="date"
            className="inp-left"
            placeholder="Enter Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="buttons">
          <button className="btn-one" onClick={handleResult}>View Result</button>
        </div>

        {resultData && <p>{resultData.message}</p>}
        {resultData && <p>Result: {JSON.stringify(resultData.result)}</p>}
      </div>
    </div>
  </div>
</div>

</>

  );
}

export default ViewResult;
