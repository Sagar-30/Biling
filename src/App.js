import './App.css';
import { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import Sanscript from "sanscript";
import useNameSpeechHook from './useNameSpeechHook';
import useSpeechHook from './useSpeechHook';

function App() {
  const [Name, setName] = useState("");
  const [FinalName, setFinalName] = useState("");
  const [OutputItemName, setItemNameOutput] = useState("");
  const [Address, SetAddress] = useState("");
  const [currentDate, SetCurrentDate] = useState("");
  const [number, setNumber] = useState("");
  const [Item, setItem] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Amount, setAmount] = useState("");
  const [billData, setBillData] = useState([]);
  const [finalAmount, setFinalAmount] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const { fieldData, transcript, listening, startListening, stopListening, resetFieldTranscript, setLanguage, language, } = useSpeechHook();
  const { transcript: customerName, listening: customerNameListening, startListening: startCustomerNameListening, stopListening: stopCustomerNameListening } = useNameSpeechHook();
  function addButton(e) {
    if (Name && Item && Quantity && Amount) {
      e.preventDefault();
      let data = { Name, Item, Quantity, Amount };
      setBillData([...billData, data]);
      // setName("");
      // setItem("");
      // setQuantity("");
      // setAmount("");
    }
  }

  useEffect(() => {
    let current = new Date().toLocaleDateString();
    SetCurrentDate(current)
  }, [])

  useEffect(() => {
    setName(fieldData.customerName || "");
    SetAddress(fieldData.customerAddress || "");
    setItemNameOutput(fieldData.ItemName || "");
  }, [transcript]);

  //Testing 
  const displayedText = customerNameListening ? `${FinalName} ${customerName}`.trim() : FinalName;
  const handleStop = () => {
    stopCustomerNameListening();
    setFinalName(displayedText); // Save combined text
  };

  //TESTING END
  function handleRemove(index) {
    let data = billData.filter((value, i) => i !== index);
    setBillData(data);
  }


  //Changing Text to marathi
  // const setItemNameHandler = (e) => {
  //   setItem(e.target.value);
  //   transliterateText(e.target.value);
  //   setItemNameOutput(e.target.value)
  // }
  function handleSpace(e) {
    if (e.key === " ") {
      // console.log("Space");
      // const convertedText = Sanscript.t(e.target.value, "itrans", "devanagari");
      // setItemNameOutput(convertedText);
      transliterate(e.target.value).then(console.log);
    }
  }

  const setItemNameHandler = (e) => {
    const inputText = e.target.value;
    
    // Convert English/Hinglish to Marathi in real-time
    const marathiText = Sanscript.t(inputText, "itrans", "devanagari");
    setItem(marathiText);
    setItemNameOutput(marathiText);
  };

  async function transliterate(text) {
    const url = `https://inputtools.google.com/request?itc=mr-t-i0-und&text=${encodeURIComponent(text)}&num=5`;

    const response = await fetch(url);
    const data = await response.json();

    if (data[0] === "SUCCESS") {
        return data[1][0][1][0]; // First suggestion
    } else {
        return "Translation failed";
    }
}


  // const setItemNameHandler = (e) => {
  //   const inputText = e.target.value;
  //   // Convert English/Hinglish to Marathi in real-time
  //   const marathiText = toDevanagari(inputText);
  //   setItem(marathiText);
  //   setItemNameOutput(marathiText);
  // };

  //Adding Rows Dynamically
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
  //Printing PDF
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

  // console.log(customerNameListening)
  return (
    <div className="main-div">
      <div className="form-div">
        <form>
          <div className="form-group recorder-group">
            <div className="controls">
              {!customerNameListening ?
                <span className="btn btn-start" onClick={startCustomerNameListening}>प्रारंभ करा</span> :
                <span className="btn btn-stop" onClick={() => { handleStop() }}>थांबवा</span>
              }
            </div>
            <label htmlFor="customerName">ग्राहकाचे नाव</label>
            <input type="text" value={displayedText} className="btn-space" placeholder="उदा: सिद्धेश" id="customerName" name="customerName" required onChange={(e) => { setFinalName(e.target.value) }} />
          </div>
          <div className="form-group recorder-group">
            <div className="controls">
              <span className="btn btn-start" onClick={() => startListening("customerAddress")}>प्रारंभ करा</span>
              <span className="btn btn-stop" onClick={stopListening}>थांबवा</span>
            </div>
            <label htmlFor="customerName">ग्राहकाचा पत्ता</label>
            <input type="text" value={Address} className="btn-space" placeholder="उदा: पुणे" id="customerName" name="customerName" required onChange={(e) => { SetAddress(e.target.value) }} />
          </div>
          <div className="form-group">
            <label htmlFor="customerName">क्रम</label>
            <input type="text" value={number} placeholder="उदा: 1" id="customerName nubmer-date" name="customerName" required onChange={(e) => { setNumber(e.target.value) }} />
          </div>
          <div className="form-group recorder-group">
            <div className="controls">
              <span className="btn btn-start" onClick={() => startListening("ItemName")}>प्रारंभ करा</span>
              <span className="btn btn-stop" onClick={stopListening}>थांबवा</span>
            </div>
            <label htmlFor="itemName">आयटमचे नाव</label>
            <input type="text" value={OutputItemName} className="btn-space" placeholder="उदा: पेन" id="itemName" name="itemName" required onChange={setItemNameHandler} onKeyPress={handleSpace}/>
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
          <img src="./maaSaraswati.jpg" alt="First" className="header-img1" />
          <span>
            <h1>रुपाली स्टेशनरी अँड झेरॉक्स</h1>
            <p>सोळंकी टॉवर, शॉप नं. 11, एस. टी. स्टॅन्ड समोर, सासवड</p>
            <p>मोबाइल: 8888133484</p>

          </span>
          <img src="./logo.jpg" alt="Second" className="header-img2" />
        </div>
        <p style={{ textAlign: "center", marginBottom: "30px" }}>
          शालेय स्टेशनरी, ऑफिस स्टेशनरी, छपाई, गिफ्ट आर्टिकल्स, वाढदिवसासाठी साहित्य,
          झेरॉक्स, कलर झेरॉक्स, लॅमिनेशन, स्कॅनिंग, बाईंडिंग, मिळेल.
        </p>

        <div className="info-section">
          <div className="row">
            <p><b>नंबर:</b> 1</p>
            <p className="date-Input"><b>दि: </b>
              <input type="text" value={currentDate} placeholder="29/01/2025" id="customerName" name="customerName dateInput" required onChange={(e) => { SetCurrentDate(e.target.value) }} />
            </p>
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
                {/* {console.log("item", item)} */}
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
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4"><b>एकूण :</b></td>
              <td>___________________</td>
            </tr>
          </tfoot>
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