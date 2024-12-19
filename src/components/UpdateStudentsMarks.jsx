import React, { useState } from 'react';

const UpdateStudentMarks = ({ closePopup }) => {
  const [seatNumber, setSeatNumber] = useState('');
  const [marks, setMarks] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object with the data
    const data = { seatNumber, marks };

    try {
      // Make a POST request to your API (Replace the URL with your actual API endpoint)
      const response = await fetch('http://localhost:3000/admin/submitMarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials:"include"
      });

      // Check if the request was successful
      if (response.ok) {
        alert('Marks updated successfully!');
        closePopup();
      } else {
        alert('Failed to update marks');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
          <button
            onClick={closePopup}
            className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800"
          >
            X
          </button>
          <h2 className="text-2xl font-semibold mb-4">Enter Marks</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="seatNumber" className="block text-gray-700">Seat Number:</label>
              <input
                type="text"
                id="seatNumber"
                name="seatNumber"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md outline-red-500"
                required
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="marks" className="block text-gray-700">Marks:</label>
              <input
                type="text"
                id="marks"
                name="marks"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md outline-red-500"
                required
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateStudentMarks;
