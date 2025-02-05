import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { motion } from "framer-motion"
import { FiEdit2, FiSave, FiX, FiCamera } from "react-icons/fi"

function Profile() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (userData) {
      const parsedData = JSON.parse(userData)
      setUser(parsedData)
      setEditedUser(parsedData)
    }
  }, [])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedUser({ ...editedUser, [name]: value })
  }

  const handleSave = async () => {
    setUser(editedUser)
    setIsEditing(false)

    if (selectedFile) {
      const formData = new FormData()
      formData.append("file", selectedFile)

      try {
        const token = sessionStorage.getItem("token")

        const response = await fetch("/api/user/profilePic", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        const data = await response.json()

        if (data.url) {
          const updatedUser = { ...editedUser, profilePic: data.url }
          setUser(updatedUser)
          sessionStorage.setItem("user", JSON.stringify(updatedUser))
        }
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    } else {
      sessionStorage.setItem("user", JSON.stringify(editedUser))
    }
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
    setPreview(null)
    setSelectedFile(null)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
      <NavBar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex flex-col items-center py-10 px-4"
      >
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg border border-gray-200 p-10">
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-40 h-40 rounded-full border-4 border-gray-300 overflow-hidden relative shadow-md"
            >
              {preview ? (
                <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              ) : user.profilePic ? (
                <img src={user.profilePic || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-5xl font-bold text-white">
                  {user.name[0]}
                </div>
              )}
              {isEditing && (
                <label
                  htmlFor="profile-pic"
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition-opacity opacity-0 hover:opacity-100"
                >
                  <FiCamera className="text-white text-3xl" />
                  <input id="profile-pic" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
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
  )
}

export default Profile

