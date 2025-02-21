import html2pdf from "html2pdf.js";

export function ensureTableRows() {
    const tableBody = document.querySelector("table tbody");
    const rows = tableBody.querySelectorAll("tr").length;
  
    const minimumRows = 8;
    for (let i = rows; i < minimumRows; i++) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      `;
      tableBody.appendChild(emptyRow);
    }
  }
  
  export function printBill(Name) {
    const element = document.querySelector(".todoList-div");
    const removeButtons = document.querySelectorAll(".Remove-button-td");
    removeButtons.forEach(button => (button.style.display = "none"));
    ensureTableRows();
    const options = {
      margin: [20, -20, -20, -20],
      filename: `${Name}.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: {
        scale: 4,
        useCORS: true,
        windowWidth: document.body.scrollWidth,
      },
      jsPDF: {
        unit: "pt",
        format: [element.scrollWidth, element.scrollHeight],
        orientation: "portrait",
      },
    };
    html2pdf().set(options).from(element).save().then(() => {
      removeButtons.forEach(button => (button.style.display = ""));
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
  