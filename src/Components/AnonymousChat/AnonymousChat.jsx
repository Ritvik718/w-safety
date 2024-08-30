import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, push, off } from "firebase/database";
import { auth } from "../../firebase"; // Adjust the path if needed

const db = getDatabase();

const AnonymousChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = ref(db, "messages");

    // Handler to update the state with new messages
    const handleMessagesUpdate = (snapshot) => {
      const data = snapshot.val();
      const messagesArray = [];
      for (let id in data) {
        messagesArray.push({ id, ...data[id] });
      }
      setMessages(messagesArray);
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
      push(messagesRef, newMessageObj);
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-xl shadow-md">
      <div className="h-96 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="font-semibold">{message.user}: </span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l-md"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-pink-600 text-white px-4 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AnonymousChat;
