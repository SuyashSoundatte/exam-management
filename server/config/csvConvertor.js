// const mongoose = require('mongoose');
const { Parser } = require('json2csv'); // For converting JSON to CSV
const fs = require('fs');
const User = require("../models/Student.models"); // Replace with the correct path to your schema file

const exportToCSV = async (req, res) => {
  try {
    const users = await User.find({}); // Adjust query if needed

    if (users.length === 0) {
      console.log('No data found in the Student collection.');
      return;
    }

    // Define the fields (columns) for the CSV
    const fields = [
      'firstName',
      'middleName',
      'lastName',
      'gender',
      'dateOfBirth',
      'address',
      'cityOrVillage',
      'mobileNumber',
      'whatsappNumber',
      'email',
      'schoolName',
      'board',
      'medium',
      'seatNumber',
      'result'
    ];

    // Create a JSON-to-CSV parser with the defined fields
    const parser = new Parser({ fields });

    // Convert JSON data to CSV
    const csv = parser.parse(users);

    res.setHeader("Content-Type", "application/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=StudentData.csv`,
    )

    console.log("csv created")
    return res.status(200).send(Buffer.from(csv, "binary"));
    
  } catch (err) {
    console.error('Error exporting users to CSV:', err);
    return res.status(501).json({
      message:"failed to create csv file"
    })
  }
}

// Call the function to execute the export
module.exports = {exportToCSV};
