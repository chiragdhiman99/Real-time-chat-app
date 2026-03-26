import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [myId, setMyId] = useState("");

   useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id);
    });
  }, []);

  // ✅ receive message
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [
        ...prev,
        {
          text: data.text,
          sender: data.id === myId ? "me" : "other",
        },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [myId]);

  // ✅ send message (NO local add)
  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        <div className="bg-blue-600 text-white p-4 text-lg font-semibold">
          💬 Chat App
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100">
          {chat.length === 0 && (
            <p className="text-gray-400 text-center">No messages yet...</p>
          )}

          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow ${
                  msg.sender === "me"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;