import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUser(parsedData);
      setEditedUser(parsedData);
    }
  }, []);

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
        setEditedUser(response.data);
      } else {
        sessionStorage.removeItem("user");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

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
    sessionStorage.setItem("user", JSON.stringify(editedUser));

    const token = sessionStorage.getItem("token");
    await fetchUser(token); // Re-fetch user data after saving the edits
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    setPreview(null);
    setSelectedFile(null);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("/api/user/profilePic", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data)
      if (data) {
        const updatedUser = { ...editedUser, profilePic: data.url };
        setUser(updatedUser);
        setEditedUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));


        await fetchUser(token);
      } else {
        console.error("Error uploading image:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteProfilePic = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch("api/user/profilePic", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...editedUser, profilePic: null };
        setUser(updatedUser);
        setEditedUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        setPreview(null);
        setSelectedFile(null);

        // Fetch updated user data after deleting profile picture
        await fetchUser(token);
      } else {
        console.error("Failed to delete profile picture:", data);
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-50 to-blue-500 min-h-screen flex flex-col items-center py-7 px-4"
      >
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 p-10">
          <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-10">Profile</h2>

          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-40 h-40 rounded-full border-4 border-gray-300 overflow-hidden shadow-md"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className={`w-full h-full object-cover transition-opacity ${
                    hovered ? "opacity-50" : "opacity-100"
                  }`}
                />
              ) : user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className={`w-full h-full object-cover transition-opacity ${
                    hovered ? "opacity-50" : "opacity-100"
                  }`}
                />
              ) : (
                <div className="w-full h-full bg-white
                 flex items-center justify-center text-5xl font-bold text-blue-600">
                  {user.name[0]}
                </div>
              )}

              {hovered && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black bg-opacity-50 rounded-full px-4">
                  <label htmlFor="profile-pic" className="cursor-pointer flex items-center justify-center">
                    <MdOutlineSystemUpdateAlt className="text-white text-3xl" />
                    <input
                      id="profile-pic"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <div className="h-[2px] w-full bg-white"></div>

                  <button onClick={handleDeleteProfilePic} className="flex items-center justify-center">
                    <RiDeleteBin2Fill className="text-red-500 text-3xl" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          <motion.h2 layout className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 text-center text-3xl font-bold outline-none"
              />
            ) : (
              user.name
            )}
          </motion.h2>
          <p className="text-center text-gray-500 mb-8">{user.role}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["email", "address", "contact", "city", "state", "pincode"].map((field) => (
              <motion.div
                key={field}
                layout
                className="flex flex-col border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md"
              >
                <span className="text-gray-600 font-medium mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={editedUser[field]}
                    onChange={handleInputChange}
                    className="border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-gray-800"
                  />
                ) : (
                  <span className="text-gray-800 font-semibold">{user[field] || "N/A"}</span>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition flex items-center"
                >
                  <FiSave className="mr-2" />
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full shadow-md hover:bg-gray-300 transition flex items-center"
                >
                  <FiX className="mr-2" />
                  Cancel
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditToggle}
                className="bg-gray-800 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-900 transition flex items-center"
              >
                <FiEdit2 className="mr-2" />
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Profile;
