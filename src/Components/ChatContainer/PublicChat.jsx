import React, { useState, useEffect } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "../../firebase";

const PublicChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, "publicMessages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = [];
      for (let id in data) {
        messagesArray.push({ id, ...data[id] });
      }
      setMessages(messagesArray);
    });
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messagesRef = ref(database, "publicMessages");
      const newMessageObj = {
        text: newMessage,
        timestamp: new Date().toISOString(),
        user: "Anonymous",
      };
      push(messagesRef, newMessageObj);
      setNewMessage("");
    }
  };

  return (
    <div>
      <div className="h-64 overflow-y-auto mb-4">
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
          className="bg-blue-600 text-white px-4 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PublicChat;
