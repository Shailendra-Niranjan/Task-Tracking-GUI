import { useState } from "react";
import NavBar from "./NavBar";
import { AiOutlineDelete } from "react-icons/ai";

const Teamform = () => {

    const[memberName,setMemberName] = useState('');

    const [teamArr, setTeamArr] = useState(['shera']);

    const handleAdd = () => {
        if (memberName.trim() !== "") {
            setTeamArr([...teamArr, memberName]); // Add the new member to the team array
            setMemberName(""); // Clear the input field after adding
          }
    }

    return (
        <>
        <NavBar />

        <div className="text-2xl bg-white border-2 border-black text-center mt-3 p-2 rounded-md w-[20%]  mx-auto">
            Add New Teams
        </div>

        <div className="shadow-2xl border-2 mx-11 mt-7">

        <div className="text-2xl bg-white  text-center mt-3 p-2 rounded-md w-[40%]  mx-auto ">
           <div>
                <div className="text-2xl">
              <label className="text-black text-xl mb-2 block">Enter Your Team's Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="Enter your team name"
                />
                <label className="text-black text-xl mb-2 block mt-2">Number Of  Team Member</label>
                <input
                name="name"
                type="text"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="Enter your team name"
                />
                
                <label className="text-black text-xl mb-2 block mt-2">Add Team Member</label>
                <input
                name="name"
                type="text"
                value={memberName}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                placeholder="Enter your team name"
                onChange={(e) => setMemberName(e.target.value)}
                />
                <button 
                className="text-lg rounded-lg px-1 bg-blue-400 mt-3 w-full"
                onClick={handleAdd}
                >+Add
                </button>

                </div>
           </div>
        </div>
        
        <div className="mt-5">
        {teamArr.map((member, index) => (
          <div
          key={index}
          className="text-white flex justify-between"
          >
        <div className="border-2 flex space-x-6 bg-green-400 mx-auto w-[20%] rounded-md p-1">
          <span className="mx-auto text-xl">{member}</span>
          <button
            onClick={() => {
                setTeamArr((prevTeamArr) =>
                    prevTeamArr.filter((_, i) => i !== index)
            );
        }}
        className=" text-black  text-xl rounded-md border-2 border-gray-600 hover:bg-red-600 transition-all duration-200"
        >
            <AiOutlineDelete />
          </button>
        </div>
        </div>
         ))}
        </div>


        </div>



        
        </>
    )
}

export default Teamform;