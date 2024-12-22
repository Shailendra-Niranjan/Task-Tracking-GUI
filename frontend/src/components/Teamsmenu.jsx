import React , {useEffect, useState} from "react";



const Teamsmenu = () => {

  const[teams,setTeams] = useState([]);
  const[loading,setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  console.log(token);

  
  const fetchData = async (endpoint, options) => {

    const defaultHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

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

  useEffect(  () => {

    const fetchTeams = async () => {
      setLoading(true);

      try{
        const response = await fetchData(`/team`, {
          method: 'GET'
        });
        setTeams(response)
        console.log(response);
      } 
      catch (error) {
        console.error("Error fetching teams:", error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []); 
        
     
  return (
    <div className="w-[60%] flex items-center justify-left bg-white p-4 mx-2 mt-1 h-auto shadow-md border-2">
      <div className="w-full rounded-lg shadow-lg p-8 space-y-2">
        <p className="text-xl text-center font-bold">YOUR Teams</p>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-600"> Loading teams...</p>
          ) : teams.length > 0 ? (
            teams.map((team) => (
              <div
                key={team.id}
                className="w-full bg-black text-white py-3 rounded-md text-sm font-semibold px-5 flex"
              >
                <p className="mr-2">Team Name: {team.teamName}</p>
                <p className="mx-auto">Total Members: {team.teamUsers}</p>
                <p>Total Tasks: {team.teamTask}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No teams found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teamsmenu;