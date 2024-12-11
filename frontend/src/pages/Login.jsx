import React, { useState } from "react";
import axios from "axios";
import NavBarForAuth from "../components/NavBarForAuth";


const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('clicked')
    axios.post("https://task-racker.onrender.com/auth/login", {
        email: email,
        password: password,
      })
      .then((result) => {
        if((result)){
          console.log(result.data   );
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (

    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
        <NavBarForAuth />

        

      <div className="fixed inset-0   flex justify-center items-center ">
        <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] sm:w-[50%] md:w-[40%] lg:w-[30%] relative">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Enter Email"
                value={email}
                onChange={(Event) => setemail(Event.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Enter Password"
                value={password}
                onChange={(Event) => setpassword(Event.target.value)}
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg w-full"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
