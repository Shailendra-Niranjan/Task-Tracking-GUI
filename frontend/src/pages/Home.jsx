import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
const [user, setUser] = useState([]);


const navigate = useNavigate()

 
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
      } else {
        sessionStorage.removeItem("user");
      }
    } catch (error) {
      console.log(error);
    }
  }; 




  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const sessionToken = sessionStorage.getItem('token');

    const token = urlToken || sessionToken;
      
      if(token){
        if (urlToken) {
          sessionStorage.setItem('token', urlToken); 
        }
        fetchUser(token);
      }else{
       
        console.error("No token received");
        navigate("/login");
       
      }

   

    
  }, [navigate]);

  

  return (
    <>
      <NavBar />

      <main className="bg-white min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-black mb-6">
            Manage Your Tasks Effortlessly
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            Organize your work, track progress, and boost productivity with our
            minimalist task management solution.
          </p>
        </div>
        <div className="max-w-lg w-full">
          <img
            src="https://img.freepik.com/free-vector/task-list-concept-illustration_114360-4707.jpg"
            alt="Task Management"
            className="w-full object-cover rounded-md shadow-lg"
          />
        </div>
      </main>
    </>
  );
}

export default Home;
