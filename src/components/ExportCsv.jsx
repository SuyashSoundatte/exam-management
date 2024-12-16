import React from "react";

const ExportButton = ({ fileName = "data.csv", buttonText = "Export to CSV", className = "btn btn-export", tableId }) => {
  const exportToCsv = () => {
    let rows = document.querySelectorAll('#${tableId} tr');
    if (rows.length === 0) {
      alert("No data available to export!");
      return;
    }

    let data = [];
    for (let i = 0; i < rows.length; i++) {
      let row = [], col = rows[i].querySelectorAll("td, th");
      for (let j = 0; j < col.length; j++) {
        row.push(escapeCsvValue(col[j].innerText));
      }
      data.push(row.join(","));
    }

    downloadCsv(data.join("\n"), fileName);
  };

  const escapeCsvValue = (value) => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      value = value.replace(/"/g, '""');
      return "${value}"; 
    }
    return value;
  };

  const downloadCsv = (csv, fileName) => {
    try {
      let csvFile = new Blob([csv], { type: "text/csv" });
      let downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.download = fileName;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <button className={className} onClick={exportToCsv}>
      {buttonText}
    </button>
  );
};

export default ExportButton;