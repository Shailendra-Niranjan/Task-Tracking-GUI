import React, { useState } from "react";
import axios from "axios";
import NavBarForAuth from "../components/NavBarForAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
    axios
      .post("https://task-racker.onrender.com/auth/login", {
        email: email,
        password: password,
      })
      .then((result) => {
        if (result) {
          sessionStorage.setItem("token",result.data);
          navigate("/")
          console.log( "token"+result.data);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <>
      <NavBarForAuth />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 w-[90%] sm:w-[50%] md:w-[40%] lg:w-[30%] justify-center border-black rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="set-email">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-black rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter Email"
              value={email}
              onChange={(Event) => setemail(Event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="set-password">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border border-black rounded-md px-4 mt-1 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter Password"
              value={password}
              onChange={(Event) => setpassword(Event.target.value)}
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none shadow-md"
            >
              Login
            </button>
          </div>
        </form>
        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-black font-semibold hover:underline"
          >
            Signup here
          </a>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
