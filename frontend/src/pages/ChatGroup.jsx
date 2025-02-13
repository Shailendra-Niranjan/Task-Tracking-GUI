import React, { useState, useEffect, useRef } from 'react';
import { FaEllipsisV, FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import NewGroupForm from './NewGroupForm';

const DEFAULT_GROUPS = [
  { id: 1, name: "Team Channel", description: "Main team communication channel", isDefault: true },
  { id: 2, name: "General Discussion", description: "General team discussions", isDefault: true },
  { id: 3, name: "Task Updates", description: "Project and task related updates", isDefault: true },
];

const ChatGroup = ({ team, onClose, currentUser, users }) => {
  
  console.log(team)
  
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");

  const messagesEndRef = useRef(null);

  
  const teamMembers = [
    ...(users.creator ? [users.creator] : []),
    ...(users.admins || []),
    ...(users.users || [])
  ];
 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleCreateGroup = (newGroup) => {
    const groupToAdd = {
      ...newGroup,
      isDefault: false,
      members: newGroup.selectedMembers.map(id => 
        teamMembers.find(member => member.id === id)
      ).filter(Boolean)
    }
    
    setGroups(prevGroups => [...prevGroups, groupToAdd])
    
    setSelectedGroup(groupToAdd)
    setIsModalOpen(false)
    
    
    setMessages(prevMessages => [...prevMessages, {
      id: Date.now(),
      text: `Group "${groupToAdd.name}" created`,
      sender: "System",
      timestamp: new Date().toISOString(),
      groupId: groupToAdd.id,
      isSystemMessage: true
    }])
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: currentUser.name,
        timestamp: new Date().toISOString(),
        groupId: selectedGroup.id
      }
      setMessages(prev => [...prev, newMsg])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }

  const handleEditMessage = (message) => {
    setIsEditing(message.id)
    setEditText(message.text)
  }

  const handleUpdateMessage = (messageId) => {
    if (editText.trim()) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, text: editText, edited: true }
          : msg
      ))
      setIsEditing(null)
      setEditText("")
    }
  }

  const handleDeleteGroup = (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return

    setGroups(prev => prev.filter(group => group.id !== groupId))
    if (selectedGroup.id === groupId) {
      setSelectedGroup(groups[0])
    }
    setMenuOpen(null)
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Left Sidebar - Groups List */}
      <aside className="w-1/5 bg-gray-800 p-3 border-r border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded"
            title="Back to Tasks"
          >
            <FaArrowLeft size={16} />
          </button>
          <h2 className="text-md font-semibold flex-1 text-center">Groups</h2>
          <button
            className="p-1 text-sm flex items-center gap-1 bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus size={12} /> New
          </button>
        </div>

        <ul className="space-y-1">
          {groups.map((group) => (
            <li
              key={group.id}
              className={`p-2 rounded cursor-pointer flex justify-between items-center text-sm ${
                selectedGroup.id === group.id
                  ? "bg-blue-500"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setSelectedGroup(group)}
            >
              <div className="flex-1">
                <div>{group.name}</div>
                {group.description && (
                  <div className="text-xs text-gray-300 truncate">
                    {group.description}
                  </div>
                )}
              </div>
              {!group.isDefault && (
                <div className="relative">
                  <button
                    className="p-1 hover:bg-gray-600 rounded"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuOpen(menuOpen === group.id ? null : group.id)
                    }}
                  >
                    <FaEllipsisV size={14} />
                  </button>
                  {menuOpen === group.id && (
                    <div className="absolute right-0 mt-2 w-28 bg-gray-700 shadow-lg rounded-lg text-sm z-10">
                      <button 
                        className="block w-full px-3 py-2 text-left hover:bg-gray-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditMessage(group)
                        }}
                      >
                        <FaEdit size={12} /> Edit
                      </button>
                      <button 
                        className="block w-full px-3 py-2 text-left text-red-400 hover:bg-gray-600 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteGroup(group.id)
                        }}
                      >
                        <FaTrash size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Team Members</h3>
          <ul className="space-y-1">
            {teamMembers.map((member, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-center gap-2 p-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {member.name || member}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Chat Section */}
      <div className="w-4/5 flex flex-col">
        <nav className="bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700">
          <div>
            <h2 className="text-md font-semibold">{selectedGroup.name}</h2>
            {selectedGroup.description && (
              <p className="text-sm text-gray-400">{selectedGroup.description}</p>
            )}
          </div>
          <span className="text-sm text-gray-400">
            {selectedGroup.members 
              ? `${selectedGroup.members.length} members`
              : `${teamMembers.length} members`}
          </span>
        </nav>

        <div className="flex-1 p-4 overflow-y-auto text-sm space-y-4">
          {messages.filter(msg => msg.groupId === selectedGroup.id).length === 0 ? (
            <p className="text-gray-400 text-center">
              Start the conversation in {selectedGroup.name}
            </p>
          ) : (
            messages
              .filter(msg => msg.groupId === selectedGroup.id)
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.isSystemMessage 
                      ? "items-center" 
                      : message.sender === currentUser.name 
                        ? "items-end" 
                        : "items-start"
                  }`}
                >
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    message.isSystemMessage 
                      ? "bg-gray-700 text-gray-300"
                      : message.sender === currentUser.name
                        ? "bg-blue-500"
                        : "bg-gray-700"
                  }`}>
                    {!message.isSystemMessage && (
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-semibold">{message.sender}</span>
                        <span className="text-xs text-gray-300 ml-2">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    {isEditing === message.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="bg-gray-600 p-1 rounded text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateMessage(message.id)}
                          className="text-xs bg-green-500 px-2 py-1 rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <p>{message.text}</p>
                        {message.edited && (
                          <span className="text-xs text-gray-300 mt-1">(edited)</span>
                        )}
                      </>
                    )}
                    
                    {!message.isSystemMessage && message.sender === currentUser.name && !isEditing && (
                      <div className="flex gap-2 mt-2 text-xs">
                        <button
                          onClick={() => handleEditMessage(message)}
                          className="text-gray-300 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-gray-800 flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 bg-gray-700 rounded outline-none text-sm resize-none"
            placeholder="Type a message... (Press Enter to send)"
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>

      {isModalOpen && (
        <NewGroupForm
          membersList={teamMembers}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  )
}

export default ChatGroup