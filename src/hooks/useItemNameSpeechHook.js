// import SpeechRecognition,{ useSpeechRecognition } from "react-speech-recognition";

// export default function useItemNameSpeechHook() {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition();

//   const startListening = () => {
//     resetTranscript();
//     SpeechRecognition.startListening({
//       continuous: true,
//       language: "mr-IN"
//     });
//   };

//   const stopListening = () => {
//     SpeechRecognition.stopListening();
//   };

//   if (!browserSupportsSpeechRecognition) {
//     console.warn("Browser does not support speech recognition.");
//     return {
//       error: "Browser does not support speech recognition.",
//       transcript: "",
//       listening: false,
//       startListening: () => {},
//       stopListening: () => {},
//     };
//   }

//   return {
//     transcript,
//     listening,
//     startListening,
//     stopListening,
//   };
// }

import useSpeechHook from "./useSpeechRecognitionHook";
export default () => useSpeechHook('mr-IN');