import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { auth } from "../../firebase"; // Adjust the path if needed
import { motion, AnimatePresence } from "framer-motion";

const db = getDatabase();

const AnonymousChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = ref(db, "messages");

    // Handler to update the state with new messages
    const handleMessagesUpdate = (snapshot) => {
      const data = snapshot.val();
      console.log("Data received from Firebase:", data); // Debug log
      if (data) {
        const messagesArray = [];
        for (let id in data) {
          messagesArray.push({ id, ...data[id] });
        }
        setMessages(messagesArray);
      }
    };

    // Start listening to the messages
    const unsubscribe = onValue(messagesRef, handleMessagesUpdate);

    return () => {
      // Cleanup listener on component unmount
      unsubscribe();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messagesRef = ref(db, "messages");
      const newMessageObj = {
        text: newMessage,
        timestamp: new Date().toISOString(),
        user: auth.currentUser ? auth.currentUser.email : "Anonymous",
      };
      console.log("Sending message to Firebase:", newMessageObj); // Debug log
      push(messagesRef, newMessageObj)
        .then(() => {
          setNewMessage("");
        })
        .catch((error) => {
          console.error("Error sending message:", error); // Debug log
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 p-4">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="h-96 overflow-y-auto mb-4 p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-inner">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className="mb-3 p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <span className="font-semibold text-blue-600">
                  {message.user}:{" "}
                </span>
                <span>{message.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 rounded-r-md hover:from-pink-600 hover:to-red-600 transition duration-300"
          >
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnonymousChat;
