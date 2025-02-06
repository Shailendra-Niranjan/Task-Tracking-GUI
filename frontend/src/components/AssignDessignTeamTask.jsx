import { motion } from "framer-motion"
import { useEffect, useState, useMemo } from "react"
import { toast, ToastContainer } from "react-toastify"
import { IoClose } from "react-icons/io5"
import { useParams } from "react-router-dom"

const AssignDessignTeamTask  = ({ onClose }) => {

//   const [assigne, setAssigne] = useState("None")
//   const [dependency, setDependency] = useState("None")
//   const [assignedUser, setAssignedUser] = useState(null)
//   const [dependentUser, setDependentUser] = useState(null)
//   const [taskName, setTaskName] = useState("task")
//   const [subTaskID, setSubTaskId] = useState("")

//   const { teamId } = useParams()

//   useEffect(() => {
//     setSubTaskId(subTask[0].id)
//   }, [subTask])

//   const totalMembers = useMemo(
//     () => [
//       ...allUser.users.map((user) => ({ name: user.name, email: user.email })),
//       ...allUser.admins.map((user) => ({ name: user.name, email: user.email })),
//       { name: allUser.creator.name, email: allUser.creator.email },
//     ],
//     [allUser],
//   )

  const token = sessionStorage.getItem("token")
  const fetchData = async (endpoint, options) => {
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
    }

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options?.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Fetch error:", error)
      throw error
    }
  }

//   useEffect(() => {
//     setSubTaskName(subTask[0].title)
//   }, [subTask])

//   useEffect(() => {
//     if (subTask.length > 0) {
//       if (subTask[0].assigne) {
//         const foundUser = totalMembers.find((user) => user.email === subTask[0].assigne)
//         if (foundUser && foundUser.email !== assignedUser?.email) {
//           setAssignedUser(foundUser)
//           setAssigne(foundUser.name)
//         }
//       }

//       if (subTask[0].dependency) {
//         const foundDependent = totalMembers.find((user) => user.email === subTask[0].dependency)
//         if (foundDependent && foundDependent.email !== dependentUser?.email) {
//           setDependentUser(foundDependent)
//           setDependency(foundDependent.name)
//         }
//       }
//     }
//   }, [subTask, totalMembers, assignedUser, dependentUser])

//   const handleTaskAssign = async () => {
//     const assignData = new FormData()
//     assignData.append("assigne", assigne)
//     assignData.append("teamId", teamId)
//     assignData.append("subTaskId", subTaskID)

//     const dependencyData = new FormData()
//     dependencyData.append("dependency", dependency)
//     dependencyData.append("teamId", teamId)
//     dependencyData.append("subTaskId", subTaskID)

//     try {
//       const response = await fetchData("team/addAssigneInTeamSubTask", {
//         method: "POST",
//         body: assignData,
//       })
//       if (response) {
//         console.log("assigning done")
//         toast.success("Task assigned successfully")
//       }

//       const data = await fetchData("/team/addDependencyInTeamSubTask", {
//         method: "POST",
//         body: dependencyData,
//       })
//       if (data) {
//         console.log("dependence done")
//         toast.success("Dependency set successfully")
//       }

//       onClose()
//     } catch (err) {
//       console.log(err)
//       toast.error("An error occurred. Please try again.")
//     }
//   }

  return (
    <>
      <ToastContainer />
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl p-6 w-96"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Assign Task</h2>
            <button className="text-gray-500 hover:text-gray-700 transition-colors" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
              <input
                type="text"
                // value={subTaskName}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
                disabled={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                name="assignUsers"
                // value={assigne}
                onChange={(e) => setAssigne(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
              >
                {/* {assignedUser ? (
                  <option key={assignedUser.email} value={assignedUser.email}>
                    {assignedUser.name}
                  </option>
                ) : (
                  <option key="none" value="None">
                    None
                  </option>
                )}
                {totalMembers.map((user, id) => (
                  <option key={id} value={user.email}>
                    {user.name}
                  </option>
                ))} */}
              </select>
            </div>

            <button
              type="button"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            //   onClick={handleTaskAssign}
            >
              Set Assignment
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default AssignDessignTeamTask;

