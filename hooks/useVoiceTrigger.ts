import { useEffect, useState, useRef } from 'react';

export const useVoiceTrigger = (actionCallback: () => void, targetWord: string = "help") => {
  const [isListening, setIsListening] = useState(false);
  const [lastHeard, setLastHeard] = useState<string>("");
  const callbackRef = useRef(actionCallback);
  const targetWordRef = useRef(targetWord);

  // Keep refs fresh
  useEffect(() => {
    callbackRef.current = actionCallback;
  }, [actionCallback]);

  useEffect(() => {
    targetWordRef.current = targetWord;
  }, [targetWord]);

  useEffect(() => {
    // Browser compatibility check
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      // Attempt to restart automatically to simulate "always listening"
      setIsListening(false);
      setTimeout(() => {
        try {
            recognition.start();
        } catch (e) {
            // Ignore start errors
        }
      }, 1000);
    };

    recognition.onresult = (event: any) => {
      const results = event.results;
      const latestResult = results[results.length - 1];
      const transcript = latestResult[0].transcript.trim().toLowerCase();
      
      setLastHeard(transcript);

      // Keyword Detection Logic
      const keyword = targetWordRef.current.toLowerCase();
      if (transcript.includes(keyword)) {
        console.log(`Keyword '${keyword}' detected. Triggering action.`);
        callbackRef.current();
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
    }

    return () => {
      recognition.abort();
    };
  }, []);

  return { isListening, lastHeard };
};