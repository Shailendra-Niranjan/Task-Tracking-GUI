import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Users, BarChart2, Clock, RefreshCcw, Smartphone } from "lucide-react";
import NavBar from "../components/NavBar";
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const WEBSOCKET_URL = "https://task-racker.onrender.com/taskTracker"; // Replace with actual WebSocket URL

const Home = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('sahutanush29@gmail.com');
  const navigate = useNavigate();

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Object.keys(response.data).length > 0) {
        sessionStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        await setEmail(response.data.email);
      } else {
        sessionStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // useEffect(() => {
  //   console.log("Email 1:", email);

  //   const connectToWebSocket = (email) => {
  //     if (!email) return;

  //   console.log("Email websocketwali:", email);
  //     const socket = new SockJS(WEBSOCKET_URL);
  //     console.log('sokets-objects',socket)
  //     const stompClient = Stomp.over(socket);
  //     console.log('stopmptClient-objects',socket)

  //     stompClient.connect({}, () => {
  //       console.log(`Connected as ${email}`);
  //       stompClient.send("/app/register-user", {}, JSON.stringify({ email }));
  //       window.stompClient = stompClient;
  //     });
  //   };

  //   if (email) {
  //     connectToWebSocket(email);
  //   }
  // }, [email]); // Run only when `email` updates

  useEffect(() => {
    const fetchAndCall = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      const sessionToken = sessionStorage.getItem("token");

      const token = urlToken || sessionToken;

      if (token) {
        if (urlToken) {
          sessionStorage.setItem("token", urlToken);
        }
        await fetchUser(token);
      } else {
        console.error("No token received");
        navigate("/login");
      }
    };

    fetchAndCall();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <NavBar />
      <main>
        {/* Hero Section */}
        <section className="pt-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                className="flex-1 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Transform Your <span className="text-blue-600">Workflow</span>
                  <br />
                  Track with Ease
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg">
                  Stay organized, meet deadlines, and achieve more with our intuitive task management platform.
                </p>
                <motion.button
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/tasks")}
                >
                  Get your task tracked!
                </motion.button>
              </motion.div>
              <motion.div
                className="flex-1 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-20 animate-pulse" />
                <img
                  src="https://img.freepik.com/free-vector/task-list-concept-illustration_114360-4707.jpg"
                  alt="Task Management"
                  className="relative rounded-2xl shadow-2xl w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Email Debug Section */}
        <section className="p-4 bg-gray-100 text-center">
          <h3 className="text-lg font-semibold">Logged in as:</h3>
          <p className="text-xl text-blue-600">{email ? email : "Loading..."}</p>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-500">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Stay Productive</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Powerful features that help you manage tasks, collaborate with team members, and achieve your goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Task Organization",
                  description: "Organize tasks with custom labels, priorities, and due dates.",
                  icon: <CheckCircle className="w-8 h-8 text-blue-500" />,
                },
                {
                  title: "Team Collaboration",
                  description: "Work together seamlessly with real-time updates and notifications.",
                  icon: <Users className="w-8 h-8 text-blue-500" />,
                },
                {
                  title: "Progress Tracking",
                  description: "Monitor project progress with visual charts and analytics.",
                  icon: <BarChart2 className="w-8 h-8 text-blue-500" />,
                },
                {
                  title: "Deadline Management",
                  description: "Never miss a deadline with automated reminders and alerts.",
                  icon: <Clock className="w-8 h-8 text-blue-500" />,
                },
                {
                  title: "Custom Workflows",
                  description: "Create and customize workflows that match your process.",
                  icon: <RefreshCcw className="w-8 h-8 text-blue-500" />,
                },
                {
                  title: "Mobile Access",
                  description: "Access your tasks anywhere with our mobile-friendly interface.",
                  icon: <Smartphone className="w-8 h-8 text-blue-500" />,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
