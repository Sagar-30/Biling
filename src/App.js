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
  const [isEditingCurrentDate, setisEditingCurrentDate] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [Item, setItem] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Amount, setAmount] = useState("");
  const [billData, setBillData] = useState([]);
  const [finalAmount, setFinalAmount] = useState("");
  const [MarathiNumer, setMarathiNumer] = useState("");
  const [SerialNumber, setSerialNumber] = useState("");
  const [clearForm, setClearForm] = useState(true);
  const [resetLocalStorageNo, setResetLocalStorageNo] = useState("");
  const [reload,setReload] = useState(true)
  const editableRef = useRef(null);
  let currentDateFocus = useRef();

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
      if (billData.length < 20) {
        setBillData([...billData, data]);
      } else {
        alert("आपण नंतर 20 आयटम जोडू शकत नाही");
      }

      setItem("");
      setQuantity("");
      setAmount("");
    }
  }
  function handleRemove(index) {
    let data = billData.filter((value, i) => i !== index);
    setBillData(data);
  }
  function clearFormData() {
    setFinalName("");
    SetAddress("");
    setBillNumber("");
    setItem("");
    setQuantity("");
    setAmount("");
    setBillData([]);
    setFinalAmount("");
    setMarathiNumer("");
  }
  useEffect(() => {
    setTimeout(() => {
      clearFormData()
    }, 2000)
  }, [clearForm])

  useEffect(() => {
    let current = new Date().toLocaleDateString();
    SetCurrentDate(current)
  }, []);

  //serial number logic
  useEffect(() => {
    let num = null;
    num = localStorage.getItem("Sno");
    console.log("LocalStorage number:", num)
    if (num === null || num === "") {
      localStorage.setItem("Sno", "1001");
    };
    setSerialNumber(localStorage.getItem("Sno"))
  }, [clearForm])

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
  }, [billData]);

  function ResetBillNumberLocalStorage(){
    const userConfirmed = window.confirm("रीसेट करण्यासाठी ठीक आहे?");
  if (userConfirmed && resetLocalStorageNo) {
    setReload(!reload);
    localStorage.setItem("Sno", resetLocalStorageNo);
  }
  }

  return (
    <div className="main-div">
      {/* Reset bill Number*/}
      <div style={{margin:"2px"}}>
        <input placeholder="बिल क्रमांक रीसेट करा" onChange={(e)=>setResetLocalStorageNo(e.target.value)} style={{border:"1px solid red"}}/>
        <input type="submit" style={{cursor:"pointer", color:"red"}} onClick={ResetBillNumberLocalStorage}/>
      </div>
      {/* div */}
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
            <label htmlFor="billNumber">बिल नं</label>
            <input type="number" value={billNumber} placeholder="उदा: 1" id="customerName nubmer-date" name="billNumber" required onChange={(e) => { setBillNumber(e.target.value) }} />
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
            <label htmlFor="itemQty">नग</label>
            <input type="number" value={Quantity} placeholder="उदा: 2" id="itemQty" name="itemQty" required onChange={(e) => { setQuantity(e.target.value) }} />
          </div>
          <div className="form-group">
            <label htmlFor="itemAmount">रक्कम</label>
            <input type="number" value={Amount} placeholder="उदा: 20" id="itemAmount" name="itemAmount" required onChange={(e) => { setAmount(e.target.value) }} />
          </div>
          <button onClick={(e) => addButton(e)}>जोडा</button>
        </form>

      </div>
      <div className="todoList-div" >

        <div className="header1">
          <img src="./maaSaraswati.jpg" alt="First" className="header-img1" />
          <span>
            <h1 style={{
              fontFamily: "'Baloo Bhaijaan 2', cursive",
              fontWeight: 800,
              fontSize: "28px",
              textAlign: "center",
              color: "#b30000",
              marginBottom: "5px"
            }}>रुपाली स्टेशनर्स अ‍ॅण्ड झेरॉक्स</h1>
            <p>सोळंकी टॉवर, शॉप नं. 11, एस. टी. स्टॅन्ड समोर, सासवड</p>
            <p>मोबाइल: 9881832458</p>

          </span>
          <img src="./logo.jpg" alt="Second" className="header-img2" />
        </div>
        <h5 style={{
          textAlign: "center",
          marginBottom: "1px",
          marginTop: "12px",
          fontFamily: "'Baloo Bhaijaan 2', cursive",
          fontWeight: 550,
          fontSize: "16px"
        }}>
          शालेय स्टेशनरी, ऑफिस स्टेशनरी, प्रिंट, गिफ्ट आर्टिकल्स, वाढदिवसासाठी साहित्य,
          झेरॉक्स, कलर झेरॉक्स, लॅमिनेशन, स्कॅनिंग, बाईंडिंग मिळेल.
        </h5>

        <div className="info-section">
          <div className="row">
            <p><b>बिल नं:</b>{billNumber ? billNumber : SerialNumber}</p>
            {/* <p className="date-Input"><b>दि: </b>
            <span><input type="text" value={currentDate} onChange={(e)=>SetCurrentDate(e.target.value)} className="date-input-form hide-on-print"></input></span>
              <span ref={editableRef} className="date-input-form hide-inside-form">{currentDate} </span>
            </p> */}
            <p className="date-Input">
                  <b>दि: </b>
                  {isEditingCurrentDate ? (
                    <input type="text" value={currentDate} onChange={(e) => SetCurrentDate(e.target.value)} onBlur={() => setisEditingCurrentDate(false)} className="date-input-form" autoFocus/>
                  ) : (
                    <span ref={currentDateFocus} className="date-input-form" tabIndex={0} onFocus={() => setisEditingCurrentDate(true)}>{currentDate}</span>)
                    }
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
            ))
            }
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
        <button onClick={() => { printBill(FinalName,billNumber); setClearForm(!clearForm) }}>Print Bill</button>
      </div>
    </div>
  );
}

export default App;