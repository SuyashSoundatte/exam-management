const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Correctly set the path to the admin.xlsx file located in the 'uploads' folder
const excelFilePath = path.join(__dirname, '../uploads/admin_data.xlsx');

// Function to read the Excel file
const readExcelFile = () => {
    if (!fs.existsSync(excelFilePath)) {
        throw new Error('Excel file not found');
    }

    const workbook = XLSX.readFile(excelFilePath);
    const sheetNames = workbook.SheetNames;
    
    const adminsSheet = workbook.Sheets[sheetNames[0]];
    const adminsData = XLSX.utils.sheet_to_json(adminsSheet);
    
    return adminsData;
};


// Get list of approved admins
const getApprovedAdmins = () => {
    const adminsData = readExcelFile();
    return adminsData.filter(admin => admin.isApproved === 'yes');
};

// Get college and city data (assuming it's in the second sheet)
const getCollegeAndCityData = () => {
    const workbook = XLSX.readFile(excelFilePath);
    const sheetNames = workbook.SheetNames;

    // Reading the second sheet (CollegesAndCities)
    const collegeCitySheet = workbook.Sheets[sheetNames[1]];
    const collegeCityData = XLSX.utils.sheet_to_json(collegeCitySheet);

    return collegeCityData;
};

module.exports = {
    getApprovedAdmins,
    getCollegeAndCityData
};
