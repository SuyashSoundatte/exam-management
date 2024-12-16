import React from "react";

const ExportButton = ({ buttonText = "Export to CSV", className = "btn btn-export" }) => {
  const exportToCsv = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/exportToCSV", {
        method: "GET",
        headers: {
          "Accept": "text/csv", // Specify that we expect CSV data
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();

        // Ensure the blob is treated as a CSV file
        const csvFile = new Blob([blob], { type: "text/csv;charset=utf-8;" });

        const downloadLink = document.createElement("a");
        const url = window.URL.createObjectURL(csvFile);

        downloadLink.href = url;
        downloadLink.download = "data.csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to export data. Please check the server response.");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("An error occurred while exporting data.");
    }
  };

  return (
    <button className={className} onClick={exportToCsv}>
      {buttonText}
    </button>
  );
};

export default ExportButton;
