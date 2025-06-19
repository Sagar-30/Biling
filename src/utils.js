import html2pdf from "html2pdf.js";

function ensureTableRows() {
    const tableBody = document.querySelector("table tbody");
    const rows = tableBody.querySelectorAll("tr").length;
    
    const minimumRows = 20;
    let addedRows = [];
    for (let i = rows; i < minimumRows; i++) {
      const emptyRow = document.createElement("tr");
      // Mark the row as temporary for printing
      emptyRow.setAttribute("data-print", "true");
      emptyRow.innerHTML = `
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      `;
      tableBody.appendChild(emptyRow);
      addedRows.push(emptyRow);
    }
    return addedRows;
  }
  
  export function printBill(Name,billNumber) {
    console.log(billNumber);
    if(!billNumber){
    let number = +localStorage.getItem("Sno");
    localStorage.setItem("Sno", number + 1);
    }
    const element = document.querySelector(".todoList-div");
    const removeButtons = document.querySelectorAll(".Remove-button-td");
    const inputDateSpan = document.querySelectorAll(".hide-inside-form");
    const DateSpan = document.querySelectorAll(".hide-on-print");
    removeButtons.forEach(button => (button.style.display = "none"));
    inputDateSpan.forEach(button => (button.style.display = "none"));
  
    // Add empty rows for printing and keep track of them
    const addedRows = ensureTableRows();
  
    const options = {
      margin: [5, -40],
      filename: `${Name}.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: {
        scale: 4,
        useCORS: true,
        windowWidth: document.body.scrollWidth,
      },
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "portrait",
        autoPaging: true,
      },
    };
  
    html2pdf().set(options).from(element).save().then(() => {
      removeButtons.forEach(button => (button.style.display = ""));
      // Remove the temporary rows added for printing
      addedRows.forEach(row => row.remove());
    });
  }

  

  export async function translateIntoMarathi (text) {
    const url = `https://inputtools.google.com/request?itc=mr-t-i0-und&text=${encodeURIComponent(text)}&num=5`;

    const response = await fetch(url);
    const data = await response.json();

    if (data[0] === "SUCCESS") {
      return data[1][0][1][0];
    } else {
      return "Translation failed";
    }
  }

// export async function translateIntoMarathi (text) {
//     const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=mr&dt=t&q=${encodeURIComponent(text)}`;
  
//     const response = await fetch(url);
//     const data = await response.json();
//     return data[0][0][0];
//   };

  //translateIntoMarathi("text").then(console.log).catch(); 
  