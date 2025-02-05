import { useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const WEBSOCKET_URL = "https://task-racker.onrender.com/taskTracker";

const useWebSocket  = (username) => {

    useEffect(() => {
    window.global = window;

    if (!username) return; // Ensure username exists

    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log(`Connected as ${username}`);

      // Send username to backend
      stompClient.send("/app/register-user", {}, JSON.stringify({ username }));

      // Save client in window object (for global access)
      window.stompClient = stompClient;  // Use window instead of global
    });

    // Cleanup on unmount
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log(`Disconnected: ${username}`);
        });
      }
    };
  }, [username]);
};


export default useWebSocket;