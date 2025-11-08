import React, { useState, useEffect, useRef } from "react";

function App() {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Idle 💤");
  const [transcript, setTranscript] = useState("");
  const [voice, setVoice] = useState(null);
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported on this browser!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => setStatus("🎙️ Listening...");
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      handleCommand(text);
    };
    recognition.onerror = () => {
      setStatus("❌ Error");
      setListening(false);
    };
    recognition.onend = () => {
      setStatus("Idle 💤");
      setListening(false);
    };

    recognitionRef.current = recognition;
    startListening();
  }, []);

  // Select best available voice
  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("english india"));
    const femaleVoice = voices.find(v => v.name.toLowerCase().includes("female"));
    setVoice(maleVoice || femaleVoice || voices[0]);
  });

  // Text-to-Speech with natural tone
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.rate = 1;
    utter.pitch = 1;
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
    setStatus("🔊 Speaking...");
    utter.onend = () => setStatus("Idle 💤");
  };

  // Command handler
  const handleCommand = (command) => {
    if (command.includes("hello jarvis")) {
      speak("Hello sir, how can I assist you?");
    } else if (command.includes("open youtube")) {
      speak("Opening YouTube");
      window.open("https://www.youtube.com", "_blank");
    } else if (command.includes("open google")) {
      speak("Opening Google");
      window.open("https://www.google.com", "_blank");
    } else if (command.includes("open camera")) {
      speak("Opening camera");
      window.open("https://camera.google.com", "_blank");
    } else if (command.includes("open gallery")) {
      speak("Opening gallery");
      window.open("https://photos.google.com", "_blank");
    } else if (command.includes("what time")) {
      const time = new Date().toLocaleTimeString();
      speak(`The time is ${time}`);
    } else if (command.includes("what date")) {
      const date = new Date().toLocaleDateString();
      speak(`Today's date is ${date}`);
    } else {
      speak("Sorry, I didn't catch that. Please repeat.");
    }
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "black",
        color: "#00ffc8",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace",
        textAlign: "center",
      }}
    >
      <h1>🤖 Jarvis PWA Assistant</h1>
      <p>Status: {status}</p>
      <button
        onClick={startListening}
        style={{
          backgroundColor: listening ? "#444" : "#00ffc8",
          border: "none",
          borderRadius: "50%",
          width: 90,
          height: 90,
          fontSize: 30,
          color: "black",
          cursor: "pointer",
        }}
      >
        🎙️
      </button>
      <p style={{ marginTop: "20px" }}>You said: {transcript || "..."}</p>
    </div>
  );
}

export default App;
