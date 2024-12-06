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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-sm w-3/4 bg-white rounded-lg shadow-md p-6">
        <div className="text-2xl font-bold text-gray-700 mb-6 text-center">
          View Result
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div className="mb-4">
          
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            placeholder="Enter Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <button
          onClick={handleResult}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
        >
          View Result
        </button>

        {resultData && (
          <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-500 text-green-700">
            <p>{resultData.message}</p>
            {resultData.result && (
              <p className="mt-2">
                Result: <span className="font-mono">{JSON.stringify(resultData.result)}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default ViewResult;
