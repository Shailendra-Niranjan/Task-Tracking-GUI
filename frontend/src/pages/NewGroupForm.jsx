import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ToggleSwitch = ({ isOn, onToggle }) => (
  <div
    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${isOn ? "bg-blue-500" : "bg-gray-400"}`}
    onClick={onToggle}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${isOn ? "translate-x-5" : ""}`}
    ></div>
  </div>
);

const MemberTag = ({ member, onRemove }) => (
  <div className="flex items-center bg-gray-700 px-2 py-1 rounded text-sm">
    {member?.name}
    <button onClick={() => onRemove(member.id)} className="ml-2 text-red-400 hover:text-red-600">
      <FaTimes />
    </button>
  </div>
);

const mockMembers = [
  { id: 1, name: "Alice Johnson", designation: "Developer" },
  { id: 2, name: "Bob Smith", designation: "QA" },
  { id: 3, name: "Charlie Brown", designation: "Developer" },
  { id: 4, name: "David White", designation: "QA" },
  { id: 5, name: "Eve Black", designation: "Developer" }
];

const NewGroupForm = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedMembers: [],
  });
  const [toggles, setToggles] = useState({
    dev: false,
    qa: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSelectAll = (role) => {
    const filteredIds = mockMembers
      .filter((member) => member.designation === role)
      .map((member) => member.id);

    setFormData(prev => {
      const allSelected = filteredIds.every((id) => prev.selectedMembers.includes(id));
      const newMembers = allSelected 
        ? prev.selectedMembers.filter((id) => !filteredIds.includes(id))
        : [...new Set([...prev.selectedMembers, ...filteredIds])];
      
      return { ...prev, selectedMembers: newMembers };
    });

    setToggles(prev => ({
      ...prev,
      [role === "Developer" ? "dev" : "qa"]: !prev[role === "Developer" ? "dev" : "qa"]
    }));
  };

  const handleCreate = () => {
    if (!formData.name.trim()) return;
    onCreate({ 
      id: Date.now(), 
      ...formData,
      members: formData.selectedMembers 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Create New Group</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <FaTimes className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            className="w-full p-2 bg-gray-700 rounded outline-none text-sm"
            placeholder="Team Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          
          <textarea
            name="description"
            className="w-full p-2 bg-gray-700 rounded outline-none text-sm"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <select
            className="w-full p-2 bg-gray-700 rounded outline-none text-sm"
            onChange={(e) => {
              const id = Number(e.target.value);
              if (id && !formData.selectedMembers.includes(id)) {
                setFormData(prev => ({
                  ...prev,
                  selectedMembers: [...prev.selectedMembers, id]
                }));
              }
            }}
            value=""
          >
            <option value="">Select Members</option>
            {mockMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.designation})
              </option>
            ))}
          </select>

          <div className="flex justify-between items-center">
            <span className="text-sm">Select All Developers</span>
            <ToggleSwitch 
              isOn={toggles.dev} 
              onToggle={() => toggleSelectAll("Developer")} 
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Select All QA</span>
            <ToggleSwitch 
              isOn={toggles.qa} 
              onToggle={() => toggleSelectAll("QA")} 
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Selected Members:</h3>
            <div className="flex flex-wrap gap-2">
              {formData.selectedMembers.map((id) => {
                const member = mockMembers.find((m) => m.id === id);
                return (
                  <MemberTag 
                    key={id} 
                    member={member}
                    onRemove={(id) => {
                      setFormData(prev => ({
                        ...prev,
                        selectedMembers: prev.selectedMembers.filter(
                          memberId => memberId !== id
                        )
                      }));
                    }}
                  />
                );
              })}
            </div>
          </div>

          <button 
            className="w-full bg-blue-500 py-2 rounded hover:bg-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
