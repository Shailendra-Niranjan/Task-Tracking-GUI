import { useState, useEffect } from "react";
import NavBarForAuth from "./NavBarForAuth";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Teamform = () => {

  const  navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamArr, setTeamArr] = useState([]);
  

  let debounceTimeout;

  const fetchData = async (endpoint, options) => {
    const defaultHeaders = {
      'Authorization': `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  const handleSearch = (type, value) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    setError(null);

    if (type === "name") {
      setUsers(value);
    } else {
      setEmail(value);
    }

    debounceTimeout = setTimeout(async () => {
      if (!value.trim() && !email.trim() && !users.trim()) {
        setResult([]);
        return;
      }

      setLoading(true);

      try {
        const searchParams = new URLSearchParams({
          name: type === "name" ? value : users,
          email: type === "email" ? value : email
        });

        const data = await fetchData(`/team/getUserForTeam?${searchParams}`, {
          method: 'GET'
        });
        
        setResult(data);

      } catch (error) {
        setError('An error occurred while searching. Please try again.');
        console.log(error);
        setResult([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleCreateTeam = async () => {

    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }
    if (teamArr.length === 0) {
      setError('Please add at least one team member');
      return;
    }
    
    setLoading(true);
    
    try {

      const formData = new FormData();
      formData.append('teamName',teamName);
      
      teamArr.map( (user,index) => (
        formData.append(`users`,user)
      ))
      
      const data = await fetchData('/team/create', {
        method: 'POST',
        body: formData,
      });

      setTeamArr([]);
      setEmail("");
      setTeamName("");
      setUsers("");
      navigate("/teams");
      
      console.log('Team created:', data);
      

    } catch (error) {
      setError('An error occurred while creating the team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, []);



  const handleSelect = (member) => {
      if(teamArr.includes(member)){
        alert(`${member} Already in team`)
      }
      else{
        setTeamArr((prev) => [...prev,member]);
      }
  }

  const handleDelete = (index) => {
    const updatedTeam = teamArr.filter( (_,i) => i !== index)
    setTeamArr(updatedTeam);
  }

  return (
    <>
      <NavBarForAuth />
      <div className="shadow- border-black mt-8 mx-24">
        <div className="text-3xl text-center font-semibold mt-6">
          Create Team
        </div>
        <div className="w-[40%] mx-auto mt-6 bg-white p-4 rounded-lg shadow-2xl">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter team name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="text"
              placeholder="Search by name"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              value={users}
              onChange={(e) => handleSearch("name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by email"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              value={email}
              onChange={(e) => handleSearch("email", e.target.value)}
            />
          </div>
          <div>
            {loading ? (
              <p className="p-2 text-gray-600">Loading...</p>
            ) : result.length === 0 && (users.trim() || email.trim()) ? (
              <p className="p-2 text-gray-600">No results found.</p>
            ) : (
              result.map((user, index) => (
                <button
                  key={index}
                  className="p-2 border-b border-gray-300 result-item hover:bg-gray-50 cursor-pointer w-full text-left"
                  onClick={() => handleSelect(user.name)}
                  value={user.name}
                >
                  {user.name}
                </button>
              ))
            )}
          </div>

          <button 
            className= "mt-6 w-full py-2 rounded-lg bg-green-500 text-white"
            onClick={handleCreateTeam}
          >
          <p>Create Team</p>
          </button>

          {teamArr.map((user, index) => (
          <div
          key={index} // Use a unique identifier from `user` if possible
          className="flex items-center text-left justify-between "
          >
          <div className="border-b border-gray-300 result-item rounded-md hover:bg-gray-50 cursor-pointer w-[40%] bg-green-200 m-1 flex justify-between items-center">
            <span>{user}</span>
            <button
              onClick={() => handleDelete(index)} // Pass index or a unique ID
              className="text-xl mx-2"
            >
              <FaDeleteLeft />
            </button>
          </div>
        </div>
      ))}
        </div>
      </div>
    </>
  );
};

export default Teamform;