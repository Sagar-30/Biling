import './App.css';
import { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";

function App() {
  const [Name, setName] = useState("");
  const [Item, setItem] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Amount, setAmount] = useState("");
  const [billData, setBillData] = useState([]);
  const [finalAmount, setFinalAmount] = useState("");
  function addButton(e) {
    // e.preventDefault();
    if (Name && Item && Quantity && Amount) {
      e.preventDefault();
      let data = { Name, Item, Quantity, Amount };
      setBillData([...billData, data]);
      // setName("");
      // setItem("");
      // setQuantity("");
      // setAmount("");
      console.log(billData);
    }
  }
  function handleRemove(index) {
    let data = billData.filter((value, i) => i !== index);
    setBillData(data);
  }
  // function printBill(){
  //   window.print();
  // }

  function ensureTableRows() {
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

  function printBill() {
    const element = document.querySelector(".todoList-div");
    const removeButtons = document.querySelectorAll(".Remove-button-td");
    removeButtons.forEach(button => (button.style.display = "none"));
    ensureTableRows()
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

  useEffect(() => {
    let totalAmt = 0;
    billData.forEach(element => {
      let sum = element.Quantity * element.Amount;
      totalAmt += sum;
      console.log(element);
    });
    setFinalAmount(totalAmt)
  }, [billData])


  return (
    <div className="main-div">
      <div className="form-div">
        <form>
          <div className="form-group">
            <label htmlFor="customerName">ग्राहकाचे नाव</label>
            <input type="text" value={Name} placeholder="उदा: सिद्धेश" id="customerName" name="customerName" required onChange={(e) => { setName(e.target.value) }} />
          </div>
          {/* <div className="form-group">
            <label htmlFor="customerName">ग्राहकाचा पत्ता</label>
            <input type="text" value={Name} placeholder="उदा: सिद्धेश" id="customerName" name="customerName" required onChange={(e) => { setName(e.target.value) }} />
          </div> */}
          <div className="form-group">
            <label htmlFor="itemName">आयटमचे नाव</label>
            <input type="text" value={Item} placeholder="उदा: पेन" id="itemName" name="itemName" required onChange={(e) => { setItem(e.target.value) }} />
          </div>
          <div className="form-group">
            <label htmlFor="itemQty">प्रमाण</label>
            <input type="text" value={Quantity} placeholder="उदा: 2" id="itemQty" name="itemQty" required onChange={(e) => { setQuantity(e.target.value) }} />
          </div>
          <div className="form-group">
            <label htmlFor="itemAmount">रक्कम</label>
            <input type="text" value={Amount} placeholder="उदा: 20" id="itemAmount" name="itemAmount" required onChange={(e) => { setAmount(e.target.value) }} />
          </div>
          <button onClick={(e) => addButton(e)}>जोडा</button>
        </form>

      </div>
      <div className="todoList-div" >

        <div className="header1">
          <h1>रुपाली स्टेशनरी अँड झेरॉक्स</h1>
          <p>सोळंकी टॉवर, शॉप नं. 11, एस. टी. स्टॅन्ड समोर, सासवड</p>
          <p>मोबाइल: 8888133484</p>
          <p>शालेय स्टेशनरी, ऑफिस स्टेशनरी, छपाई, गिफ्ट आर्टिकल्स, वाढदिवसासाठी साहित्य, झेरॉक्स, कलर झेरॉक्स, लॅमिनेशन, स्कॅनिंग, बाईंडिंग, मिळेल.</p>
        </div>

        <div className="info-section">
          <div className="row">
            <p><b>नंबर:</b> 509</p>
            <p><b>दि:</b> 01/2025</p>
          </div>
          <div className="row">
            <p><b>नाव:</b> __________________________</p>
          </div>
          <div className="row">
            <p><b>पत्ता:</b> __________________________</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>क्रमांक</th>
              <th>तपशील</th>
              <th>नग/प्रति</th>
              <th>दर</th>
              <th>रक्कम रुपये</th>
            </tr>
          </thead>
          <tbody>
            {billData && billData.map((item, index) => (
              <tr key={index}>
                {console.log("item", item)}
                <td>{index + 1}</td>
                <td>{item.Item}</td>
                <td>{item.Quantity}</td>
                <td>{item.Amount}</td>
                <td>{item.Quantity * item.Amount}</td>
                <td className="Remove-button-td">
                  <button className="remove-button" onClick={() => handleRemove(index)}>
                    काढा
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td>{billData.length + 1}</td>
              <td>___________________</td>
              <td>___________________</td>
              <td>___________________</td>
              <td>___________________</td>
            </tr>
          </tbody>
        </table>

        <div className="footer">
          <p><b>GSTIN:</b> 27ADJPT0693G1Z6</p>
          <p>अक्षरी रु: {finalAmount}</p>
          <p><b>टीप:</b> एकदा विकलेला माल परत घेतला जाणार नाही.</p>
        </div>
      </div>
      <div className="print-btn-div">
        <button onClick={printBill}>Print Bill</button>
      </div>
    </div>
  );
}

export default App;
