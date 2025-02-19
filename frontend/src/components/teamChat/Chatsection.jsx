import React from 'react';
import AppLoader from '../App-Loader';
import { motion } from "framer-motion";

export function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString + "Z");
    const secondsAgo = Math.floor((now - past) / 1000);
  
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) return `${daysAgo}d ago`;
    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) return `${monthsAgo}mo ago`;
    const yearsAgo = Math.floor(monthsAgo / 12);
  
    return `${yearsAgo}y ago`;
}

const Chatsection = ({groups,selectedGroup,chatBoxRef,loading,messages,currentUser,currentUserEmail,input,setInput,sendMessage}) =>  {
  return (
    <>
    <div className="w-4/5 flex flex-col">
            {groups.length > 0 && (
              <nav className="bg-gray-600 px-4 py-3 flex justify-between items-center border-b border-gray-900">
                <div>
                  <h2 className="text-md font-semibold">{selectedGroup}</h2>
                </div>
              </nav>
            )}

              <div className="flex-1 p-3 overflow-y-auto text-sm space-y-4 bg-gray-300 overflow-hidden ">
                <div ref={chatBoxRef} className="h-full overflow-y-auto space-y-4 pr-4">
                  { loading ?  
                    <div className="h-screen flex items-center justify-center ">
                      <div className="flex-col items-center justify-center ">
                        <AppLoader /> 
                        <p className="text-black flex-col">Loading messages...</p>
                      </div>
                    </div>
                    : messages.length > 0 &&
                    messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.senderEmail === currentUserEmail ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                            message.senderEmail === currentUserEmail ? "bg-green-400 text-white" : "bg-blue-400 text-white"
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
              </div>

            <div className="p-3 bg-gray-800 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Type your message here..."
                className="flex-1 p-2 bg-white text-black rounded outline-none text-sm resize-none"
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
    </>
  )
}

export default Chatsection;
