import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const ToggleSwitch = ({ isOn, onToggle }) => (

  <div
    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
      isOn ? "bg-blue-500" : "bg-gray-400"}` }    
    onClick={onToggle}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
        isOn ? "translate-x-5" : ""
      }`}
    ></div>
  </div>
);

const MemberTag = ({ member, onRemove }) => (
  <div className="flex items-center bg-black text-white px-2 py-1 rounded text-sm">
    {/* Render a property of the member, for example name */}
    <span>{member.name}</span>
    <button
      onClick={() => onRemove(member.email)}
      className="ml-2 text-red-400 hover:text-red-600"
    >
      <FaTimes />
    </button>
  </div>
);

const NewGroupForm = ({ membersList, onClose, onCreate ,teamId}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamId: teamId,
    selectedMembers: [],
  });

  const [toggles, setToggles] = useState({
    dev: false,
    qa: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect( () => {
    if(!toggles.dev){
      setFormData({
        ...formData,
        selectedMembers: [],
      });
    }
  },[toggles.dev])

useEffect( () => {
    if(!toggles.qa){
      setFormData({
        ...formData,
        selectedMembers: [],
      });
    }
  },[toggles.qa])

  const toggleSelectAll = (role) => {
    
    if(role == 'Developer'){
      setToggles((prev) => ({
        ...prev,
        dev: !prev.dev,
      }));
    }else{
      setToggles((prev) => ({
        ...prev,
        qa: !prev.qa,
      }));
    }
    

    if(!toggles.qa){
      setFormData({
        ...formData,
        selectedMembers: [],
      });
    }

    let filteredMembers = membersList
      .filter((member) => member.role === role)
      .filter(
        (member) =>
          !formData.selectedMembers.find((m) => m.email === member.email)
      );
    setFormData({
      ...formData,
      selectedMembers: [...formData.selectedMembers, ...filteredMembers],
    });
  };

  const handleMemberSelect = (e) => {
    const selectedEmail = e.target.value;
    if (!selectedEmail) return; // do nothing if empty
    // Find the full member object by email
    const selectedMember = membersList.find(
      (member) => member.email === selectedEmail
    );
    // Only add if not already present
    if (
      selectedMember &&
      !formData.selectedMembers.some((m) => m.email === selectedEmail)
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedMembers: [...prev.selectedMembers, selectedMember.email],
      }));
    }
  };

  const handleRemoveMember = (email) => {
    setFormData((prev) => ({
      ...prev,
      selectedMembers: prev.selectedMembers.filter(
        (member) => member.email !== email
      ),
    }));
  };

  const handleCreate = () => {
    
    onCreate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="relative bg-white text-black rounded-lg shadow-lg p-6 max-w-md transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h2 className="text-xl font-semibold">Create New Group</h2>
          <button onClick={onClose} aria-label="Close Modal" className="text-gray-400">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            className="w-full p-3 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Team Name"
            value={formData.name}
            onChange={handleInputChange}
          />

          <textarea
            name="description"
            className="w-full p-3 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <select
            className="w-full p-3 bg-gray-400 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleMemberSelect}
            value=""
          >
            <option value="">Select Members</option>
            {membersList.map((member) => (
              <option key={member.email} value={member.email} >
                {`Name: ${member.name} - Role: ${member.role}`}
              </option>
            ))}
          </select>

          <div className="flex justify-between items-center border-t border-b border-gray-700 py-2">
            <span className="text-sm">Select All Developers</span>
            <ToggleSwitch
                isOn={toggles.dev}
               onToggle={() => toggleSelectAll("Developer")}
            />
          </div>

          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="text-sm">Select All QA</span>
            <ToggleSwitch
              isOn={toggles.qa}
              onToggle={() => toggleSelectAll("Tester")}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black mb-2">
              Selected Members:
            </h3>
            <div className="flex flex-wrap gap-2">
              {formData.selectedMembers.map((member) => (
                <MemberTag
                  key={member.email}
                  member={member}
                  onRemove={handleRemoveMember}
                />
              ))}
            </div>
          </div>

          <button
            className="w-full bg-green-600 py-3 rounded text-white font-medium hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCreate}
            disabled={!formData.name.trim()}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroupForm;
