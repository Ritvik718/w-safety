// UserList.jsx
import React, { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "../../firebase"; // Adjust the path if needed

const UserList = ({ setCurrentChat }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, "users");

    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.keys(data).map((id) => ({ id, ...data[id] }));
        setUsers(userList);
      }
    };

    // Set up listener
    onValue(usersRef, handleData);

    // Clean up listener on component unmount
    return () => {
      off(usersRef, "value", handleData);
    };
  }, []);

  const handleClick = (user) => {
    setCurrentChat(user);
  };

  return (
    <div className="max-w-md w-full">
      <h2 className="text-lg font-bold mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="p-2 mb-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => handleClick(user)}
          >
            {user.identifier} {/* Adjust based on your data structure */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
