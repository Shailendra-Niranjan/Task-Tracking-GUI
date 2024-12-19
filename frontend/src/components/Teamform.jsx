import { useState } from "react";
import NavBarForAuth from "./NavBarForAuth";
import { AiOutlineSearch, AiOutlineDelete } from "react-icons/ai";

const Teamform = () => {
  const [teamName, setTeamName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [members, setMembers] = useState([
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Alice Johnson", email: "alice@example.com" },
  ]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleSearch = () => {
    // Logic to filter users (not necessary here as we are showing all initially).
  };

  const handleSelectMember = (member) => {
    if (!selectedMembers.some((m) => m.email === member.email)) {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleRemoveMember = (email) => {
    setSelectedMembers(selectedMembers.filter((m) => m.email !== email));
  };

  const handleCreateTeam = () => {
    if (!teamName || selectedMembers.length === 0) {
      alert("Please enter a team name and select members.");
      return;
    }
    alert(`Team "${teamName}" created with ${selectedMembers.length} members!`);
    setTeamName("");
    setSelectedMembers([]);
  };

  return (
    <>
      <NavBarForAuth />

      <div className="shadow- border-black mt-8 mx-24">

     
      <div className="text-3xl text-center font-semibold mt-6">Create Team</div>

      {/* Form */}
      <div className="w-[40%] mx-auto mt-6 bg-white p-4 rounded-lg shadow-2xl">
        {/* Team Name Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter team name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        {/* Search Inputs */}
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Search by name"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by email"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <button
            className="text-xl text-gray-600 hover:text-black"
            onClick={handleSearch}
          >
            <AiOutlineSearch />
          </button>
        </div>

        {/* Members List */}
        <div className="mt-4">
          {members
            .filter(
              (member) =>
                member.name.toLowerCase().includes(searchName.toLowerCase()) &&
                member.email.toLowerCase().includes(searchEmail.toLowerCase())
            )
            .map((member, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-gray-300 rounded-md px-4 py-2 mt-2"
              >
                <span>
                  {member.name} - {member.email}
                </span>
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleSelectMember(member)}
                >
                  Select
                </button>
              </div>
            ))}
        </div>

                {/* Create Team Button */}
        <button
        className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        onClick={handleCreateTeam}
        >
          Create Team
        </button>

        {/* Selected Members */}
        {selectedMembers.length > 0 && (
          <div className="mt-6">
            <div className="font-semibold text-lg">Selected Members:</div>
            {selectedMembers.map((member, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-gray-300 rounded-md px-4 py-2 mt-2"
              >
                <span>
                  {member.name} - {member.email}
                </span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveMember(member.email)}
                >
                  <AiOutlineDelete />
                </button>
              </div>
            ))}
          </div>
        )}
        </div>

      </div>
  </>
  );
};

export default Teamform;
