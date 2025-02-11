// import { useState } from "react";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// export default function useNameSpeechHook() {
//   const [language, setLanguage] = useState("mr-IN");
//   const { transcript, listening, resetTranscript, startListening } = useSpeechRecognition();
//   const [manualTranscript, setManualTranscript] = useState("");

//   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//     console.warn("Browser does not support speech recognition.");
//     return {
//       error: "Browser does not support speech recognition.",
//       transcript: "",
//       listening: false,
//       startListening: () => {},
//       stopListening: () => {},
//       resetTranscript: () => { },
//       setLanguage: () => { },
//     };
//   }

  
//   if (transcript && transcript !== manualTranscript) {
//     setManualTranscript(transcript);
//   }

  
//   const startListeningWithReset = () => {
//     resetTranscript();
//     SpeechRecognition.startListening({
//       continuous: true,  // Allow real-time updates
//       language: "mr-IN"
//     });
//   };

//   const stopListening = () => {
//     SpeechRecognition.stopListening();
//   };

  
//   const clearTranscript = () => {
//     setManualTranscript("");
//     SpeechRecognition.abortListening();
//   };

//   return {
//     transcript,
//     listening,
//     startListening: startListeningWithReset,
//     stopListening,
//     resetTranscript,
//     clearTranscript,
//     setLanguage,
//     language,
//   };
// }



//2nd Logic
import SpeechRecognition,{ useSpeechRecognition } from "react-speech-recognition";

export default function useNameSpeechHook() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListening = () => {
    resetTranscript(); // Clear previous transcript
    SpeechRecognition.startListening({
      continuous: true,
      language: "mr-IN"
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser does not support speech recognition.");
    return {
      error: "Browser does not support speech recognition.",
      transcript: "",
      listening: false,
      startListening: () => {},
      stopListening: () => {},
    };
  }

  return {
    transcript,
    listening,
    startListening,
    stopListening,
  };
}