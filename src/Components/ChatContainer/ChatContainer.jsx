import React, { useState } from "react";
import PublicChat from "./PublicChat"; // Public chat component
import PrivateChat from "./PrivateChat"; // Private chat component
import UserList from "./UserList"; // User list component

const ChatContainer = () => {
  const [isPrivateChat, setIsPrivateChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
        <button
          onClick={() => {
            setIsPrivateChat(false);
            setSelectedUser(null);
          }}
          className={`p-2 ${
            !isPrivateChat ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Public Chat
        </button>
        <button
          onClick={() => setIsPrivateChat(true)}
          className={`p-2 ${
            isPrivateChat ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Private Chat
        </button>
      </div>
      <div className="flex flex-1">
        <div className="w-1/4 bg-gray-200 p-4">
          {isPrivateChat && <UserList onUserSelect={setSelectedUser} />}
        </div>
        <div className="w-3/4 p-4">
          {isPrivateChat ? (
            selectedUser ? (
              <PrivateChat selectedUser={selectedUser} />
            ) : (
              <div>Select a user to start a private chat</div>
            )
          ) : (
            <PublicChat />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
