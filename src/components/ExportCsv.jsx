import React from 'react';

const ExportButton = ({ fileName = "data.csv" }) => {
  const exportToCsv = () => {
    let rows = document.querySelectorAll("table tr");
    var data = [];
    for (let i = 0; i < rows.length; i++) {
      var row = [], col = rows[i].querySelectorAll("td, th");

      for (let j = 0; j < col.length; j++) {
        row.push(col[j].innerText);
      }

      data.push(row.join(", "));
    }

    downloadCsv(data.join("\n"), fileName);
  };

  const downloadCsv = (csv, fileName) => {
    let csvFile = new Blob([csv], { type: "text/csv" });
    let downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.download = fileName;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <button className="btn btn-export" onClick={exportToCsv}>
      Export to CSV
    </button>
  );
};

export default ExportButton;