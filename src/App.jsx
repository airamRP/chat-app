import { useState, useEffect } from "react";
import io from "socket.io-client";

// const socket = io("http://localhost:5000"); // Conecta al backend
const socket = io("https://chat-api-ia35.onrender.com"); // Conecta Render

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  // Guarda el ID del socket local
  const [myId, setMyId] = useState("")

  // Conectar al WebSocket y escuchar mensajes
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado al servidor:", socket.id);
      setMyId(socket.id) // Almacenar el ID del socket al conectar
    });

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Limpiar al desmontar
    return () => {
      socket.off("message");
      socket.off("connect");
    };
  }, []);

  // Enviar mensaje
  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input); // Envía el mensaje al servidor
      setInput(""); // Limpia el input
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat en Tiempo Real</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            {msg.senderId === myId ? "Tú": "Otro"}: {msg.text} - {msg.timestamp}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "70%", marginRight: "10px" }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default App;