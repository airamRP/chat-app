import { useState, useEffect } from "react";
import io from "socket.io-client";

// const socket = io("http://localhost:5000"); // Conecta al backend
const socket = io("https://chat-api-ia35.onrender.com"); // Conecta Render

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  // Guarda el ID del socket local
  // const [myId, setMyId] = useState("")

  

  // Conectar al WebSocket y escuchar mensajes
  useEffect(() => {
    if (isConnected) {
      socket.on("connect", () => {
        console.log("Conectado al servidor:", socket.id);
      });

      socket.on("message", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.off("message");
        socket.off("connect");
      };
    }
  }, [isConnected]);

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      socket.emit("setNickname", nickname); // Enviar el nickname al servidor
      setIsConnected(true); // Mostrar el chat una vez que se establece el nickname
    }
  };

  // Enviar mensaje
  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input); // Envía el mensaje al servidor
      setInput(""); // Limpia el input
    }
  };

  if (!isConnected) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Bienvenido al Chat</h1>
        <form onSubmit={handleNicknameSubmit}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ingresa tu nickname"
            style={{ width: "70%", marginRight: "10px" }}
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }


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
            {msg.nickname}: {msg.text} - {msg.timestamp}
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