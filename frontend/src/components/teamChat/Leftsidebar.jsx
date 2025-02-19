import React from 'react';
import {
    FaEllipsisV,
    FaPlus,
    FaTrash,
  } from "react-icons/fa";
import { useState,useEffect } from "react";
 

const Leftsidebar = ({groupId,totalTeamMembers, groups, handleDeleteGroup,menuOpen,handleLoadmessage,setIsModalOpen,editPermisssion}) => {

    
  return (
    <>
    <aside className="w-1/5 bg-gradient-to-r from-blue-500 to-blue-200 p-3 border-2 border-gray-500">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-md font-semibold flex-1 text-center">Groups</h2>
              
              {editPermisssion &&
                <button
                className="p-1 text-sm flex items-center gap-1 bg-blue-600 hover:bg-blue-900 px-2 py-1 rounded"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus size={14} /> New
              </button>
              }
            </div>

            <div className="space-y-1">
              {groups.length > 0 &&
                groups.map((group) => (
                  <button
                    key={group.id}
                    className={`w-full p-2 rounded cursor-pointer flex justify-between items-center border-2 text-sm ${
                      groupId === group.id
                        ? "bg-gradient-to-r from-green-800 to-green-400"
                        : "hover:bg-gradient-to-r from-gray-600 to-gray-300"
                    }`}
                    onClick={() => handleLoadmessage(group.id, group.name)}
                  >
                    <div className="flex-1">
                      <div className="text-xl">{group.name}</div>
                    </div>
                    {!group.isDefault && (
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-600 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Removed handleEditMessage as it was not declared.
                          }}
                        >
                        {editPermisssion &&  <FaEllipsisV size={14} />}
                        </button>
                        {menuOpen === group.id && (
                          <div className="absolute right-0 mt-2 w-28 bg-gray-700 shadow-lg rounded-lg text-sm z-10">
                            {/* Removed the Edit button */}
                            <button
                              className="w-full px-3 py-2 text-left text-red-400 hover:bg-gray-600 flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGroup(group.id);
                              }}
                            >
                              <FaTrash size={12} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                ))}
            </div>

            <div className="mt-10 border-2 p-3 bg-gradient-to-r from-green-800 to-green-400">
              <h3 className="text-sm font-semibold mb-2 text-center">Team Members</h3>
              <ul className="space-y-2">
                {totalTeamMembers.map((member, index) => (
                  <li
                    key={index}
                    value={member.email}
                    className="text-md text-white flex items-center gap-2 p-1 border-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 "></div>
                    {member.name}
                    <span className="text-sm text-gray-900">{member.role}</span>
                   
                  </li>
                ))}
              </ul>
            </div>
          </aside>
    </>
  )
}

export default Leftsidebar