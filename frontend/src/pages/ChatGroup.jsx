import React, { useState, useEffect, useRef, useCallback } from "react";
import NewGroupForm from "./NewGroupForm";
import { useAsyncError, useLocation, useNavigate } from "react-router-dom";
import axios, { all } from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chatheader from "../components/teamChat/Chatheader";
import Leftsidebar from "../components/teamChat/Leftsidebar";
import Chatsection from "../components/teamChat/Chatsection";



const ChatGroup = () => {
  const baseURL = "https://task-racker.onrender.com";
  const navigate = useNavigate();
  const location = useLocation();

  const [loading,setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  
  const [teamId, setTeamId] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  
  useEffect(() => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      setCurrentUserEmail(user.email);
      setCurrentUser(user.name);
    }, []);

  const { team, allUsers } = location.state || {};
  const token = sessionStorage.getItem("token");

  

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setTeamId(team.id);
    if (groupId) {
      handleLoadmessage(groupId, selectedGroup);
    }
  }, [groupId]);

  const handleLoadmessage = async (id, name) => {
    setLoading(true)
    setGroupId(id);
    setSelectedGroup(name);
    try {
      const messagesResponse = await axios.get(
        `/api/team/chatgroup/getMessages?chatGroupId=${id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (messagesResponse) {
        setLoading(false)
        setMessages(messagesResponse.data);
      }
    } catch (error) {
      toast.error("Error getting messages!");
    }
  };

  const sendMessage = async () => {
    if (stompClient && groupId && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        teamId: teamId,
        chatGroupId: groupId,
        email : currentUserEmail, 
      };

      stompClient.send(`/app/sendMessage/${groupId}`, {}, JSON.stringify(message));
      setInput("");
    }
  };


  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/taskTracker`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to chat!");

        client.subscribe(`/topic/team/${groupId}`, (message) => {
          
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
          
        });
      });
    };

    if (groupId) {
      connectWebSocket();
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [groupId]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`/api/team/chatgroup/getAll?teamId=${team.id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(response.data);
        if (response.data && response.data.length > 0) {
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (location.state) {
      setTeamName(team?.teamName);
      setTeamId(team?.id);
    }
  }, [location.state, team]);

  const[editPermisssion,setEditPermission] = useState(false)

  // Setting users for Team Members list
  const creatorOfTeam = allUsers.creator.email;
  const isUserisCreator = JSON.parse(sessionStorage.getItem("user"));
  const isCreator = creatorOfTeam === isUserisCreator.email;
  const leadOfTeam = allUsers.techLead?.email;
  const isLead = leadOfTeam === isUserisCreator.email;


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

  if(!isCreator){ 
      totalTeamMembers.push({
      name: allUsers.creator.name,
      email: creatorOfTeam,
      role: "Creator",
    });
  }
  
  if(!isLead){
    const techLead = allUsers.techLead;
      totalTeamMembers.push({
      name: techLead.name,
      email: techLead.email,
      role: "Tech Lead",
      });
  }

  useEffect( () => {
    if(isCreator || isLead ){
      setEditPermission(true)
    }
  } ,[allUsers])
  

  // Handle group creation function
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
  };

  // Handle delete group
  const handleDeleteGroup = (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    setGroups((prev) => prev.filter((group) => group.id !== groupId));
    if (selectedGroup.id === groupId) {
      setSelectedGroup(groups[0]);
    }
    setMenuOpen(null);
  };

  // Handle leave room
  const handleLeaveRoom = () => {
    if (stompClient) {
      stompClient.disconnect()
    }
    setTeamName("");
    navigate("/teams/teamstask", { state: { teamId: team?.id, team: team } });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
       
        <div className="flex flex-col h-screen bg-gray-100">
        <Chatheader  teamName={teamName}  handleLeaveRoom={() => handleLeaveRoom()} currentUser={currentUser}/>

        <div className="h-screen flex bg-gray-900 text-white">
          
          {/* Left Sidebar - Groups List */}
          <Leftsidebar groupId={groupId} groups={groups} totalTeamMembers={totalTeamMembers} 
          handleDeleteGroup={handleDeleteGroup} menuOpen={menuOpen} handleLoadmessage={handleLoadmessage}
          setIsModalOpen={setIsModalOpen} editPermisssion={editPermisssion}
          />

          {/* Main Chat Section */}
          <Chatsection  groups={groups} selectedGroup={selectedGroup} chatBoxRef={chatBoxRef} loading={loading}
          messages={messages} currentUser={currentUser} currentUserEmail={currentUserEmail} input={input} setInput={setInput} sendMessage={() => sendMessage() }/>

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
