import './App.css';
import { useState, useEffect, useRef } from "react";
import useNameSpeechHook from './hooks/useNameSpeechHook';
import useAddressSpeechHook from './hooks/useAddressSpeechHook';
import { printBill, translateIntoMarathi } from './utils';
import useItemNameSpeechHook from './hooks/useItemNameSpeechHook';
import convertNumberToMarathi from './hooks/useNumberToWords';

function App() {
  const [FinalName, setFinalName] = useState("");
  const [Address, SetAddress] = useState("");
  const [currentDate, SetCurrentDate] = useState("");
  const [number, setNumber] = useState("");
  const [Item, setItem] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Amount, setAmount] = useState("");
  const [billData, setBillData] = useState([]);
  const [finalAmount, setFinalAmount] = useState("");
  const [MarathiNumer, setMarathiNumer] = useState("");

  const activeInput = useRef({
    customerName: null,
    customerAddress: null,
    itemName: null
  });

  const {
    transcript: customerName,
    isListening: customerNameListening,
    startListening: startCustomerNameListening,
    stopListening: stopCustomerNameListening
  } = useNameSpeechHook();

  const {
    transcript: customerAddress,
    isListening: customerAddressListening,
    startListening: startCustomerAddressListening,
    stopListening: stopCustomerAddressListening
  } = useAddressSpeechHook();

  const {
    transcript: ItemName,
    isListening: ItemNameListening,
    startListening: startItemNameListening,
    stopListening: stopItemNameListening
  } = useItemNameSpeechHook();

  // List add and remove feature
  function addButton(e) {
    if (FinalName && Item && Quantity && Amount) {
      e.preventDefault();
      let data = { FinalName, Item, Quantity, Amount };
      setBillData([...billData, data]);
      // setName("");
      // setItem("");
      // setQuantity("");
      // setAmount("");
    }
  }
  function handleRemove(index) {
    let data = billData.filter((value, i) => i !== index);
    setBillData(data);
  }

  useEffect(() => {
    let current = new Date().toLocaleDateString();
    SetCurrentDate(current)
  }, []);

  //Listening Feature 
  const displayedText = customerNameListening ? `${FinalName} ${customerName}`.trim() : FinalName;
  const handleStop = () => {
    stopCustomerNameListening();
    //setFinalName(displayedText); 
    setFinalName(prev => `${prev} ${customerName}`.trim());
  };

  const displayedAddressText = customerAddressListening ? `${Address} ${customerAddress}`.trim() : Address;
  const handleAddressStop = () => {
    stopCustomerAddressListening();
    //SetAddress(displayedAddressText);
    SetAddress(prev => `${prev} ${customerAddress}`.trim());
  };

  const displayedItemNameText = ItemNameListening ? `${Item} ${ItemName}`.trim() : Item;
  const handleItemNameStop = () => {
    stopItemNameListening();
    // setItem(displayedItemNameText);
    setItem(prev => `${prev} ${ItemName}`.trim());
  };

  //Listening Feature END

  

  //Changing Text to marathi
  function handleNameSpace(e) {
    if (e.key === " ") {
      translateIntoMarathi(e.target.value).then((data) => {
        setFinalName(`${data}${" "}`)
      }).catch((err) => {
        console.log("Error in Name translation", err)
      });
    }
  }
  function handleAddressSpace(e) {
    if (e.key === " ") {
      translateIntoMarathi(e.target.value).then((data) => {
        SetAddress(`${data}${" "}`)
      }).catch((err) => {
        console.log("Error in Address translation", err)
      });
    }
  }
  function handleItemNameSpace(e) {
    if (e.key === " ") {
      translateIntoMarathi(e.target.value).then((data) => {
        setItem(`${data}${" "}`)
      }).catch((err) => {
        console.log("Error in Item Name translation", err)
      });
    }
  }

  useEffect(() => {
    let totalAmt = 0;
    billData.forEach(element => {
      let sum = element.Quantity * element.Amount;
      totalAmt += sum;
      console.log(element);
    });
    setFinalAmount(totalAmt)
    setMarathiNumer(convertNumberToMarathi(totalAmt));
  }, [billData])

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
            <input type="text" value={displayedText} className="btn-space" placeholder="उदा: सिद्धेश" id="customerName" name="customerName" required onChange={(e) => { setFinalName(e.target.value) }} onKeyPress={(e) => handleNameSpace(e)} />
          </div>
          <div className="form-group recorder-group">
            <div className="controls">
              {!customerAddressListening ?
                <span className="btn btn-start" onClick={startCustomerAddressListening}>प्रारंभ करा</span> :
                <span className="btn btn-stop" onClick={() => { handleAddressStop() }}>थांबवा</span>
              }
            </div>
            <label htmlFor="customerName">ग्राहकाचा पत्ता</label>
            <input type="text" value={displayedAddressText} className="btn-space" placeholder="उदा: पुणे" id="customerName" name="customerName" required onChange={(e) => { SetAddress(e.target.value) }} onKeyPress={(e) => handleAddressSpace(e)} />
          </div>
          <div className="form-group">
            <label htmlFor="customerName">क्रम</label>
            <input type="text" value={number} placeholder="उदा: 1" id="customerName nubmer-date" name="customerName" required onChange={(e) => { setNumber(e.target.value) }} />
          </div>
          <div className="form-group recorder-group">
            <div className="controls">
              {!ItemNameListening ?
                <span className="btn btn-start" onClick={startItemNameListening}>प्रारंभ करा</span> :
                <span className="btn btn-stop" onClick={() => { handleItemNameStop() }}>थांबवा</span>
              }
            </div>
            <label htmlFor="itemName">आयटमचे नाव</label>
            <input type="text" value={displayedItemNameText} className="btn-space" placeholder="उदा: पेन" id="itemName" name="itemName" required onChange={(e) => { setItem(e.target.value) }} onKeyPress={handleItemNameSpace} />
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
            <p><b>नाव:</b> {FinalName}</p>
          </div>
          <div className="row">
            <p><b>पत्ता:</b> {Address}</p>
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
              <td>{finalAmount}</td>
            </tr>
          </tfoot>
        </table>

        <div className="footer">
          <p><b>GSTIN:</b> 27ADJPT0693G1Z6</p>
          <p><b>अक्षरी रु:</b> <b>{MarathiNumer}</b></p>
          <p><b>टीप:</b> एकदा विकलेला माल परत घेतला जाणार नाही.</p>
        </div>
      </div>
      <div className="print-btn-div">
        <button onClick={() => printBill(FinalName)}>Print Bill</button>
      </div>
    </div>
  );
}

export default App;