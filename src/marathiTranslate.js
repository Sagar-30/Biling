// import axios from "axios";
// import React, { useState } from "react";

// export default function MarathiTranslator() {
//   const [item, setItem] = useState("");
//   const [itemNameOutput, setItemNameOutput] = useState("");

//   const translateText = async (text) => {
//     try {
//       const response = await axios.post("https://libretranslate.de/translate", {
//         q: text,
//         source: "en",
//         target: "mr",
//         format: "text",
//       });
//       return response.data.translatedText;
//     } catch (error) {
//       console.error("Error translating text:", error);
//       return "Translation error";
//     }
//   };

//   const handleInput = async (e) => {
//     const inputText = e.target.value;
//     setItem(inputText);
//      console.log("enterd")
//     if (inputText.trim().endsWith(" ")) {
//         console.log("enterd2")
//       const translatedText = await translateText(inputText.trim());
//       console.log("Translation",translatedText);
//       setItemNameOutput(translatedText);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={item}
//         onChange={handleInput}
//         placeholder="Enter"
//       />
//       <p>
//         <strong>Translated Text:</strong> {itemNameOutput}
//       </p>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import useNameSpeechHook from "./useNameSpeechHook"; 

export default function MarathiTranslator() {
  const [name, setName] = useState("");
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage,
  } = useNameSpeechHook(); // Use the custom hook

  useEffect(() => {
    if (transcript.trim() !== "") {
      setName((prev) => (prev ? prev + " " + transcript : transcript)); // Append transcript
      resetTranscript(); // Reset transcript after updating
    }
  }, [transcript]);

  return (
    <div>
      <label>Enter Name:</label>
      <input type="text" value={name} readOnly />
      
      <button onClick={startListening}>
        {listening ? "Listening..." : "Start Speech"}
      </button>
      <button onClick={stopListening}>Stop</button>
      <button onClick={() => setName("")}>Clear</button>

      <p>Language: {useNameSpeechHook.language}</p>
    </div>
  );
}
