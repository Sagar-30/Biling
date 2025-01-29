 import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function useNameSpeechHook() {
  const [language, setLanguage] = useState("mr-IN"); // Default to Marathi
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.warn("Browser does not support speech recognition.");
    return {
      error: "Browser does not support speech recognition.",
      transcript: "",
      listening: false,
      startListening: () => {},
      stopListening: () => {},
      resetTranscript: () => {},
      setLanguage: () => {},
    };
  }

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage,
    language,
  };
}