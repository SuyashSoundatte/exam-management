import React from "react";

const ExportButton = ({ buttonText = "Export to Excel", className = "btn btn-export" }) => {
  const exportToExcel = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/exportToExcel", {
        method: "GET",
        headers: {
          "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Specify that we expect an Excel file
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();

        // Ensure the blob is treated as an Excel file
        const excelFile = new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
        });

        const downloadLink = document.createElement("a");
        const url = window.URL.createObjectURL(excelFile);

        downloadLink.href = url;
        downloadLink.download = "data.xlsx"; // Set the file name and extension
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to export data. Please check the server response.");
      }
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      alert("An error occurred while exporting data.");
    }
  };

  return (
    <button className={className} onClick={exportToExcel}>
      {buttonText}
    </button>
  );
};


// module.exports = ExportButton;
export default ExportButton;
