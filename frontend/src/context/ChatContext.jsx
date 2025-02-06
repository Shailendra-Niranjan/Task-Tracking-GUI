import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  
  const [teamId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [connected, setConnected] = useState(false);
  const [teamName, setTeamName] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        teamId,
        currentUser,
        connected,
        currentUserEmail,
        teamName,
        setRoomId,
        setCurrentUser,
        setConnected,
        setCurrentUserEmail,
        setTeamName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;