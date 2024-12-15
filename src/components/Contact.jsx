import React from 'react';

const ContactPopup = ({ closePopup }) => {
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
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700">Message:</label>
              <textarea 
                id="message" 
                name="message" 
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                required
              ></textarea>
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

export default ContactPopup;