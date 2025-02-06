import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import SockJS from "sockjs-client"
import { Stomp } from "@stomp/stompjs"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "../components/NavBar"
import { motion } from "framer-motion"
import { PaperAirplaneIcon, PaperClipIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid"

export function timeAgo(dateString) {
  const now = new Date()
  const past = new Date(dateString + "Z")
  const secondsAgo = Math.floor((now - past) / 1000)

  if (secondsAgo < 60) return `${secondsAgo}s ago`
  const minutesAgo = Math.floor(secondsAgo / 60)
  if (minutesAgo < 60) return `${minutesAgo}m ago`
  const hoursAgo = Math.floor(minutesAgo / 60)
  if (hoursAgo < 24) return `${hoursAgo}h ago`
  const daysAgo = Math.floor(hoursAgo / 24)
  if (daysAgo < 30) return `${daysAgo}d ago`
  const monthsAgo = Math.floor(daysAgo / 30)
  if (monthsAgo < 12) return `${monthsAgo}mo ago`
  const yearsAgo = Math.floor(monthsAgo / 12)

  return `${yearsAgo}y ago`
}

const ChatPage = () => {
  const baseURL = "https://task-racker.onrender.com"

  const [teamId, setTeamId] = useState("")
  const [currentUser, setCurrentUser] = useState("")
  const [currentUserEmail, setCurrentUserEmail] = useState("")
  const [connected, setConnected] = useState(false)
  const [teamName, setTeamName] = useState("")

  const location = useLocation()
  const team = location.state?.team

  useEffect(() => {
    if (location.state) {
      setCurrentUser(location.state?.currentUser)
      setCurrentUserEmail(location.state?.currentUserEmail)
      setConnected(location.state?.connected)
      setTeamName(team?.teamName)
      setTeamId(team?.id)
    }
  }, [location.state, team])

  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const chatBoxRef = useRef(null)
  const [stompClient, setStompClient] = useState(null)

  const token = sessionStorage.getItem("token")
  const fetchData = async (endpoint, options) => {
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
    }

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options?.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Fetch error:", error)
      throw error
    }
  }

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await fetchData(`/team/message?teamId=${teamId}`)
        setMessages(messages)
      } catch (error) {
        toast.error("Error getting messages!")
      }
    }

    if (teamId) {
      loadMessages()
    }
  }, [teamId])

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/taskTracker`)
      const client = Stomp.over(sock)

      client.connect({}, () => {
        setStompClient(client)

        toast.success("Connected to chat!")

        client.subscribe(`/topic/team/${teamId}`, (message) => {
          const newMessage = JSON.parse(message.body)
          setMessages((prev) => [...prev, newMessage])
        })
      })
    }

    if (connected && teamId) {
      connectWebSocket()
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect()
      }
    }
  }, [teamId, connected])

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        teamId: teamId,
      }

      stompClient.send(`/app/sendMessage/${teamId}`, {}, JSON.stringify(message))
      setInput("")
    }
  }

  function handleLogout() {
    if (stompClient) {
      stompClient.disconnect()
    }
    setConnected(false)
    setTeamId("")
    setCurrentUser("")
    setCurrentUserEmail("")
    setTeamName("")
    navigate("/teams/teamstask", { state: { teamId: team?.id, team: team } })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavBar />
      <ToastContainer position="top-right" autoClose={2000} />

      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Team: <span className="text-blue-600">{teamName}</span>
        </h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">
            User: <span className="font-medium">{currentUser}</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Leave Room</span>
          </motion.button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6">
        <div ref={chatBoxRef} className="h-full overflow-y-auto space-y-4 pr-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  message.sender === currentUser ? "bg-blue-500 text-white" : "bg-white text-gray-800"
                } rounded-lg shadow-md p-3`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={`https://avatar.iran.liara.run/public/${index + 1}`}
                    alt=""
                  />
                  <div>
                    <p className="font-semibold">{message.sender}</p>
                    <p className="mt-1">{message.content}</p>
                    <p className="text-xs mt-1 opacity-75">{timeAgo(message.creationDateTime)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage()
              }
            }}
            type="text"
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-200 p-2 rounded-full"
          >
            <PaperClipIcon className="h-6 w-6 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            className="bg-blue-500 p-2 rounded-full"
          >
            <PaperAirplaneIcon className="h-6 w-6 text-white" />
          </motion.button>
        </div>
      </footer>
    </div>
  )
}

export default ChatPage

