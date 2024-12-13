import React from 'react';
import { MdDelete } from "react-icons/md";


const Taskmenu = () => {

  return (
    <>

     <div className="w-[60%] flex items-center justify-left bg-white p-4 mx-2 mt-1 h-auto shadow-md border-2">
      <div className="w-full b rounded-lg shadow-lg p-8 space-y-2">  
        <p className="text-xl text-center">YOUR TASKS</p>      
          <div>
            <button
              type="button"
              className="w-full  bg-black text-white py-2 rounded-md text-sm font-semibold tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none shadow-md"
            >
              TASK1
            </button>
            <button  className='border border-black rounded-sm text-2xl mt-1'> <MdDelete /></button>
          </div>
          <div>
            <button
              type="button"
              className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none shadow-md"
            >
              TASK2
            </button>
            <button  className='border border-black rounded-sm text-2xl mt-1'> <MdDelete /></button>
          </div>
          <div>
            <button
              type="button"
              className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none shadow-md"
            >
              TASK3
            </button>
            <button  className='border border-black rounded-sm text-2xl mt-1'> <MdDelete /></button>
          </div>
          <div>
            <button
              type="button"
              className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none shadow-md"
            >
              TASK4
            </button>
            <button  className='border border-black rounded-sm text-2xl mt-1'><MdDelete /></button>
          </div>
          <div>
            <button
              type="button"
              className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-black focus:outline-none shadow-md"
            >
             TASK5
            </button>
            <button className='border border-black rounded-sm text-2xl mt-1'> <MdDelete /></button>
          </div>
        </div>
    </div>

  
    </>
  )
}

export default Taskmenu