import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import './App.css'
import { FaPaperPlane, FaBars } from "react-icons/fa";

function App() {
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* pang-connect sa database at socket.io */
  const socketRef = useRef(io('https://chat-app-design.onrender.com', {
    transports: ["websocket", "polling"]
  }));

  /* pang scroll view */
  /* para laging nasa baba at nakikita yung mga latest messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* pang get ng mga messages */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('https://chat-app-design.onrender.com/chatapp/getMessages')
        const data = await res.json()
        setMessages(data.map((msg: { message: string }) => msg.message))
      } catch (err) {
        console.log('Error fetching messages:', err)
      }
    }
    fetchMessages()

    /* para sa socket.io */
    const socket = socketRef.current;
    socket.on("receiveMessage", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data])
    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [])

  /* para sa send message form */
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() === '') return

    socketRef.current.emit("sendMessage", message)
    setMessage("")
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between bg-white p-4 shadow-md z-10">
          <h2 className="text-xl font-bold text-blue-600">ChattiDong</h2>
          <FaBars className="text-blue-600 text-xl" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex`}
            >
              <div className={`p-3 rounded-lg max-w-xs text-white bg-blue-500`}>
                <p>{msg}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="sticky bottom-0 flex items-center p-4 bg-gray-800 z-10">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 rounded-l-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            placeholder="Enter text"
            required
          />
          <button
            type="submit"
            className="bg-gray-700 p-3 rounded-r-full text-white hover:bg-gray-600 active:scale-95 transition-transform"
          >
            <FaPaperPlane />
          </button>
        </form>

      </div>
    </>
  )
}

export default App