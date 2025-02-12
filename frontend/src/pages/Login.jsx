import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Mail, Lock, GitlabIcon as GitHub, Chrome } from "lucide-react";
// import NavBarForAuth from "../components/NavBarForAuth"
import NavBar from "../components/NavBar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "https://task-racker.onrender.com/auth/login",
        {
          email,
          password,
        }
      );
      if (result.data) {
        sessionStorage.setItem("token", result.data);
        toast.success("Logged In Successfully!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-white flex flex-col">
      <NavBar />

       
      <div className="flex-grow flex items-center justify-center p-4 space-x-10">

      <img
          width="500"
          height="500"
          src="https://t4.ftcdn.net/jpg/04/60/71/01/360_F_460710131_YkD6NsivdyYsHupNvO3Y8MPEwxTAhORh.jpg"
          alt="Task Management"
          className="relative rounded-2xl shadow-2xl "
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-300 to-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Welcome Back!
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
              >
                Sign In
              </motion.button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://task-racker.onrender.com/oauth2/authorization/google"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <Chrome className="w-5 h-5" />
                <span className="ml-2">Google</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://task-racker.onrender.com/oauth2/authorization/github"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <GitHub className="w-5 h-5" />
                <span className="ml-2">GitHub</span>
              </motion.a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </a>
          </p>
        </motion.div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Login;
