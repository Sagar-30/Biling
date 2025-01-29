// import { useState } from "react";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// export default function useSpeechHook() {
//   const [language, setLanguage] = useState("mr-IN"); // Default to Marathi
//   const { transcript, listening, resetTranscript } = useSpeechRecognition();

//   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//     console.warn("Browser does not support speech recognition.");
//     return {
//       error: "Browser does not support speech recognition.",
//       transcript: "",
//       listening: false,
//       startListening: () => {},
//       stopListening: () => {},
//       resetTranscript: () => {},
//       setLanguage: () => {},
//     };
//   }

//   const startListening = () => {
//     SpeechRecognition.startListening({ continuous: true, language });
//   };

//   const stopListening = () => {
//     SpeechRecognition.stopListening();
//   };

//   return {
//     transcript,
//     listening,
//     startListening,
//     stopListening,
//     resetTranscript,
//     setLanguage,
//     language,
//   };
// }


import { useState,useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function useSpeechHook() {
  const [language, setLanguage] = useState("mr-IN"); // Default language
  const [fieldData, setFieldData] = useState({}); // Stores transcript for each field
  const [activeField, setActiveField] = useState(null); // Keeps track of the currently active field
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    console.log(transcript);
    if (activeField && transcript.trim() !== "") {  
      setFieldData((prev) => ({
        ...prev,
        [activeField]: (prev[activeField] || "") + " " + transcript,
      }));
      resetTranscript();
    }
  }, [transcript]);
  


  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.warn("Browser does not support speech recognition.");
    return {
      error: "Browser does not support speech recognition.",
      fieldData: {},
      startListening: () => {},
      stopListening: () => {},
      resetFieldTranscript: () => {},
      setLanguage: () => {},
      language: "en-US",
    };
  }

  const startListening = (field) => {
    setActiveField(field);
    SpeechRecognition.startListening({ continuous: true, language });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setActiveField(null);
  };
  
  const resetFieldTranscript = (field) => {
    setFieldData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  return {
    transcript,
    fieldData,
    listening,
    startListening,
    stopListening,
    resetFieldTranscript,
    setLanguage,
    language,
  };
}
