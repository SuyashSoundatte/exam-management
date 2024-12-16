import React, { useState } from "react";


const SuccessWindow = ({closeSuccessWindow}) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
          <button
            onClick={closeSuccessWindow}
            className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800"
          >
            X
          </button>
          <h2 className="text-1xl font-semibold mt-4 mb-4 text-center">Register Successfull</h2>
          <div className="hallTicketDownloadbutton">

          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessWindow;
