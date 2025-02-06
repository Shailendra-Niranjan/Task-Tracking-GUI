import React, { useState } from "react";
import NavBar from "../components/NavBar";
import TeamRequest from "../components/Teamrequest";
import UserNotification from "../components/UserNotification";

const Notifications = () => {
  const [showTeamNotify, setShowTeamNotify] = useState(false);
  const [activeButton, setActiveButton] = useState("notification"); // Track active button
  const [ headerName , setHeaderName ] = useState(false);
  

  const handleClick = (buttonType) => {
    setShowTeamNotify(!showTeamNotify);
    setActiveButton(buttonType);
    setHeaderName(!headerName);
  };

  return (
    <>
      <NavBar />
      <div className="p-4 max-w-4xl mx-auto">
        <div className="relative mt-8 mb-10">

          {
          headerName ? 
          <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Notifications
            </h1>
          </div>
        </div>
        :
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 px-8 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Team Notifications
              </h1>
            </div>
          </div>
          }
          
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 blur-3xl opacity-50" />
        </div>

        <div className="flex justify-start gap-3 mx-12 mt-5">
          <button
            type="button"
            className={`rounded-lg px-4 py-2 flex items-center gap-2 transition-colors ${
              activeButton === "notification"
                ? "bg-green-300 text-white border-2 border-yellow-300"
                : "bg-black text-white"
            }`}
            onClick={() => handleClick("notification")}
          >
            Notification
          </button>
          <button
            type="button"
            className={`rounded-lg px-4 py-2 flex items-center gap-2 transition-colors 
              ${
                activeButton === "team"
                  ? "bg-yellow-300 text-white border-2 border-green-300"
                  : "bg-black text-white"
              }`}
            onClick={() => handleClick("team")}
          >
            Team Request
          </button>
        </div>

        {showTeamNotify ? <TeamRequest /> : <UserNotification />}
      </div>
    </>
  );
};

export default Notifications;
