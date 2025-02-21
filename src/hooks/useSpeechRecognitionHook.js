import { useEffect, useState } from 'react';

const useSpeechHook = (lang = 'mr-IN') => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    } else {
      console.warn('Speech recognition not supported');
    }
  }, [lang]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setTranscript(''); // Reset transcript on new session
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition: !!recognition,
  };
};

export default useSpeechHook;