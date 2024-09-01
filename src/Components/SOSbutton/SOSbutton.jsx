import React, { useState, useRef, useEffect } from "react";
import { db } from "/src/firebase.js";
import { collection, addDoc } from "firebase/firestore";

const SOSButton = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [pressCount, setPressCount] = useState(0);
  const pressTimeoutRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        setPressCount((prevCount) => {
          const newCount = prevCount + 1;

          if (newCount === 3) {
            if (recording) {
              stopRecording();
            } else {
              startRecording();
            }
            return 0; // Reset count after triggering recording
          }

          // Reset count if not enough presses within timeout
          if (pressTimeoutRef.current) {
            clearTimeout(pressTimeoutRef.current);
          }
          pressTimeoutRef.current = setTimeout(() => setPressCount(0), 2000); // 2 seconds timeout
          return newCount;
        });
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      if (pressTimeoutRef.current) {
        clearTimeout(pressTimeoutRef.current);
      }
      // Clean up the media stream when the component unmounts
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        recordedChunksRef.current = [];

        // Save the recording locally
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recording.webm";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Save the recording to Firestore
        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
        fileReader.onloadend = async () => {
          const base64String = fileReader.result;

          try {
            const docRef = await addDoc(collection(db, "recordings"), {
              video: base64String,
              timestamp: new Date(),
            });
            console.log("Recording saved with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        };
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      {recording ? "Stop Recording" : "Start Recording"}
    </button>
  );
};

export default SOSButton;
