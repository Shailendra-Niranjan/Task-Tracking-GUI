import React, { useState, useEffect, useRef } from "react";
import {
  FaEllipsisV,
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import NewGroupForm from "./NewGroupForm";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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


const ChatGroup = () => {
  const baseURL = "https://task-racker.onrender.com"

  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const chatBoxRef = useRef(null)
  const [stompClient, setStompClient] = useState(null);
  const [currentUser, setCurrentUser] = useState("")
  const [currentUserEmail, setCurrentUserEmail] = useState("")

  const [teamId, setTeamId] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [teamName, setTeamName] = useState("");
  const [groupId,setGroupId] = useState('');

  const { team, allUsers } = location.state || {};
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setCurrentUserEmail(user.email)
    setCurrentUser(user.name)
  },[])

  useEffect( () => {
    setTeamId(team.id);
    if(groupId){
      handleLoadmessage(groupId,selectedGroup);
    }
  },[groupId] )

  const handleLoadmessage = async (id,name) =>  {
      
      setGroupId(id)
      setSelectedGroup(name)
      try {
        const messages = await axios.get(`/api/team/chatgroup/getMessages?chatGroupId=${id}`,{
          headers : {
            Accept : 'application/json',
            Authorization :  `Bearer ${token}`
          }
        })
        if(messages){
          console.log('messages',messages.data)
          setMessages(messages.data)
        }
      } catch (error) {
        toast.error("Error getting messages!")
      }
    }

    const sendMessage = async () => {
      if (stompClient && groupId && input.trim()) {
        
        const message = {
          sender: currentUser,
          content: input,
          teamId: teamId,
          chatGroupId : groupId,
        }
  
        stompClient.send(`/app/sendMessage/${teamId}`, {}, JSON.stringify(message))
        setInput("")
      }
    }

    useEffect(() => {
      const connectWebSocket = () => {
        const sock = new SockJS(`${baseURL}/taskTracker`)
        const client = Stomp.over(sock)
  
        client.connect({}, () => {
          setStompClient(client)
  
          toast.success("Connected to chat!")
  
          client.subscribe(`/topic/team/${groupId}`, (message) => {
            toast.success('subscribe')
            console.log(message)
            console.log('subscribe',groupId)
            const newMessage = JSON.parse(message.body)
            setMessages((prev) => [...prev, newMessage])
          })
        })
      }
  
      if (groupId) {
        connectWebSocket()
      }
  
      return () => {
        if (stompClient) {
          stompClient.disconnect()
        }
      }
    }, [groupId])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `/api/team/chatgroup/getAll?teamId=${team.id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGroups(response.data);
        if(response.data){
          setSelectedGroup(response.data[0].name);
          setGroupId(response.data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroups();
  }, [team.id]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      setTeamName(team?.teamName);
      setTeamId(team?.id);
    }
  }, [location.state, team]);

  //setting users
  const creatorOfTeam = allUsers.creator.email;
  const isUserisCreator = JSON.parse(sessionStorage.getItem("user"));
  const isCreator = creatorOfTeam === isUserisCreator.email ? true : false;

  const totalTeamMembers = [
    ...allUsers.devs.map((user) => ({
      name: user.name,
      email: user.email,
      role: "Developer",
    })),
    ...allUsers.qaDevs.map((user) => ({
      name: user.name,
      email: user.email,
      role: "Tester",
    })),
  ];

  if (!isCreator) {
    totalTeamMembers.push({
      name: isUserisCreator.name,
      email: isUserisCreator.email,
      role: "Creator",
    });
  }

  if (allUsers.techLead.length != 0) {
    totalTeamMembers.push({
      name: allUsers.techLead.name,
      email: allUsers.techLead.email,
      role: "Tech Lead",
    });
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //handle group creation function
  const handleCreateGroup = async (newGroup) => {
    try {
      const data = await axios.post("/api/team/chatgroup/create", newGroup, {
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: "http://localhost:5173",
        },
      });
    } catch (err) {
      console.log(err);
    }

    // const groupToAdd = {
    //   ...newGroup,
    //   isDefault: false,
    //   members: newGroup.selectedMembers.map(id =>
    //     teamMembers.find(member => member.id === id)
    //   ).filter(Boolean)
    // }

    // setGroups(prevGroups => [...prevGroups, groupToAdd])

    // setSelectedGroup(groupToAdd)
    // setIsModalOpen(false)

    // setMessages(prevMessages => [...prevMessages, {
    //   id: Date.now(),
    //   text: `Group "${groupToAdd.name}" created`,
    //   sender: "System",
    //   timestamp: new Date().toISOString(),
    //   groupId: groupToAdd.id,
    //   isSystemMessage: true
    // }])
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: currentUser.name,
        timestamp: new Date().toISOString(),
        groupId: selectedGroup.id,
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleEditMessage = (message) => {
    setIsEditing(message.id);
    setEditText(message.text);
  };

  const handleUpdateMessage = (messageId) => {
    if (editText.trim()) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, text: editText, edited: true } : msg
        )
      );
      setIsEditing(null);
      setEditText("");
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    setGroups((prev) => prev.filter((group) => group.id !== groupId));
    if (selectedGroup.id === groupId) {
      setSelectedGroup(groups[0]);
    }
    setMenuOpen(null);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //handle leave room button and function
  const handleLeaveRoom = () => {
    setTeamName("");
    navigate("/teams/teamstask", { state: { teamId: team?.id, team: team } });
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />

        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 mx-10">
            Team: <span className="text-blue-600">{teamName}</span>
          </h1>
          <div className="flex items-center space-x-4">
          <p className="text-gray-600">
            User: <span className="font-medium">{currentUser}</span>
          </p>
            <div
              onClick={handleLeaveRoom}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition duration-200"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Leave Room</span>
            </div>
          </div>
        </header>

        <div className="h-screen flex bg-gray-900 text-white ">
          {/* Left Sidebar - Groups List */}
          <aside className="w-1/5 bg-gradient-to-r from-blue-500 to-blue-200 p-3 border-2 border-gray-500 ">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-md font-semibold flex-1 text-center">
                Groups
              </h2>
              <button
                className="p-1 text-sm flex items-center gap-1 bg-blue-700 hover:bg-blue-900 px-2 py-1 rounded"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus size={12} /> New
              </button>
            </div>

            <div className="space-y-1 ">
              { groups.length > 0 &&  groups.map( (group) => (
                <button
                  key={group.id}
                  className={` w-full p-2 rounded cursor-pointer flex justify-between items-center border-2 text-sm ${
                    selectedGroup.id === group.id
                      ? " bg-gradient-to-r from-green-800 to-green-400"
                      : " hover:bg-gradient-to-r from-gray-600 to-gray-300"
                  }`}
                  onClick={() => handleLoadmessage(group.id , group.name)}
                >
                  <div className="flex-1">
                    <div>{group.name}</div>
                  </div>
                  {!group.isDefault && (
                    <div className="relative">
                      <button
                        className="p-1 hover:bg-gray-600 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === group.id ? null : group.id);
                        }}
                      >
                        <FaEllipsisV size={14} />
                      </button>
                      {menuOpen === group.id && (
                        <div className="absolute right-0 mt-2 w-28 bg-gray-700 shadow-lg rounded-lg text-sm z-10">
                          <button
                            className=" w-full px-3 py-2 text-left hover:bg-gray-600 flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMessage(group);
                            }}
                          >
                            <FaEdit size={12} /> Edit
                          </button>
                          <button
                            className=" w-full px-3 py-2 text-left text-red-400 hover:bg-gray-600 flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group.id);
                            }}
                          >
                            <FaTrash size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-10 border-2 p-3 bg-gradient-to-r from-green-800 to-green-400">
              <h3 className="text-sm font-semibold mb-2 text-center">
                Team Members
              </h3>
              {
                <ul className="space-y-2">
                  {totalTeamMembers.map((member, index) => (
                    <li
                      key={index}
                      value={member.email}
                      className="text-sm text-white flex items-center gap-2 p-1 border-2 "
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {member.name || member}
                      <span>{member.role}</span>
                    </li>
                  ))}
                </ul>
              }
            </div>
          </aside>

          {/* Main Chat Section */}
          <div className="w-4/5 flex flex-col">
              
            {groups.length > 0 &&  <nav className="bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700">
               <div>
            <h2 className="text-md font-semibold">{selectedGroup}</h2>
          
          </div> 
              {/* <span className="text-sm text-gray-400">
            {selectedGroup.members 
              ? `${selectedGroup.members.length} members`
              : `${teamMembers.length} members`}
          </span> */}
            </nav>}

            <div className="flex-1 p-4 overflow-y-auto text-sm space-y-4 bg-gray-300">
            <main className="flex-1 overflow-hidden p-6">
        <div ref={chatBoxRef} className="h-full overflow-y-auto space-y-4 pr-4">
          {messages.length > 0 &&  messages.map((message, index) => (
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
            </div>

            <div className="p-3 bg-gray-800 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage()
                  }
                }}
                placeholder="Type your message here..."
                className="flex-1 p-2 bg-white text-black rounded outline-none text-sm  resize-none"
                rows="1"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim()}
              >
                Send
              </button>
            </div>
          </div>

          {isModalOpen && (
            <NewGroupForm
              teamId={teamId}
              membersList={totalTeamMembers}
              onClose={() => setIsModalOpen(false)}
              onCreate={handleCreateGroup}
            />
          )}

        </div>
      </div>
    </>
  );
};

export default ChatGroup;
