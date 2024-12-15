import React, { useState } from "react";

const SuccessWindow = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl font-semibold text-green-600 mb-4 text-center">
          Registration Successful!
        </h2>
        <p className="text-gray-700 text-center mb-6">
          Student Registered Succesfully
        </p>
        <button
          onClick={handleClose}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessWindow;
