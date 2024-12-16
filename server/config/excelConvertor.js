// const mongoose = require('mongoose');
const XLSX = require('xlsx');
const fs = require('fs');
const User = require("../models/Student.models"); 

const exportToExcel = async (req, res) => {
  try {
    const users = await User.find({}); 

    if (users.length === 0) {
      console.log('No data found in the Student collection.');
      return res.status(404).json({
        message: "No data found in the Student collection."
      });
    }

    const formattedData = users.map(user => ({
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      cityOrVillage: user.cityOrVillage,
      mobileNumber: user.mobileNumber,
      whatsappNumber: user.whatsappNumber,
      email: user.email,
      schoolName: user.schoolName,
      board: user.board,
      medium: user.medium,
      seatNumber: user.seatNumber,
      result: user.result
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);


    XLSX.utils.book_append_sheet(workbook, worksheet, "StudentData");

    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=StudentData.xlsx"
    );

    console.log("Excel file created");
    return res.status(200).send(excelBuffer);
  } catch (err) {
    console.error('Error exporting users to Excel:', err);
    return res.status(501).json({
      message: "Failed to create Excel file."
    });
  }
};


module.exports = { exportToExcel };
