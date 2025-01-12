import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUser(parsedData);
      setEditedUser(parsedData);
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    setUser(editedUser);
    setIsEditing(false);
  
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      try {
        const token = sessionStorage.getItem("token"); // Retrieve token from sessionStorage
  
        const response = await fetch("/api/user/profilePic", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
          body: formData, 
        });
  
        const data = await response.json();
  
        if (data.url) {
          // Update profile picture in user data
          const updatedUser = { ...editedUser, profilePic: data.url };
          setUser(updatedUser);
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      sessionStorage.setItem("user", JSON.stringify(editedUser));
    }
  };
  

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    setPreview(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <NavBar />
      <div className="bg-white min-h-screen flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md border border-gray-300 p-10">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden relative">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-600">
                  {user.name[0]}
                </div>
              )}
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* User Name */}
          <h2 className="text-2xl font-bold text-center text-black mb-2">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-1"
              />
            ) : (
              user.name
            )}
          </h2>
          <p className="text-center text-gray-500 mb-6">{user.role}</p>

          {/* User Details */}
          <div className="grid grid-cols-2 gap-6">
            {["email", "address", "contact", "city", "state", "pincode"].map(
              (field) => (
                <div
                  key={field}
                  className="flex justify-between items-center border border-gray-200 rounded-md p-4"
                >
                  <span className="text-gray-600 font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name={field}
                      value={editedUser[field]}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-2 py-1 text-black w-2/3"
                    />
                  ) : (
                    <span className="text-black">{user[field] || "N/A"}</span>
                  )}
                </div>
              )
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-black text-white px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-800 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-black px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-black text-white px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-800 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
