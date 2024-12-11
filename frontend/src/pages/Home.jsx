import React from 'react'
import NavBar from '../components/NavBar'

function Home() {
  return (
    <>
     <NavBar/>
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
  )
}

export default Home