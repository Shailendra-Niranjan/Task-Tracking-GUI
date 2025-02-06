import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiMicrosoftTeamsLogoDuotone } from "react-icons/pi";
import { HiUserGroup } from "react-icons/hi";
import { SiGoogletasks } from "react-icons/si";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import AppLoader from "./App-Loader";
import { MdAdd } from "react-icons/md";

const Teamsmenu = () => {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const token = sessionStorage.getItem("token");


  const fetchData = async (endpoint, options) => {
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await fetchData("/team", { method: "GET" });
        console.log(response);
        setTeams(response);
        setSelectedTeam(response[0]);
        sessionStorage.setItem("response", JSON.stringify(response));
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamSelect = (teamId) => {
    const getTeam = JSON.parse(sessionStorage.getItem("response") || "[]");
    const selected = getTeam.find((x) => x.id === teamId);
    console.log(selected);
    setSelectedTeam(selected);
  };

  const handleDeleteTeam = async (team_Id) => {
    try {
      const queryTeamId = new URLSearchParams({ uuid: team_Id });
      const response = await fetchData(
        `/team/delete?${queryTeamId.toString()}`,
        {
          method: "GET",
        }
      );

      setTeams((prevTeam) => prevTeam.filter((team) => team.id !== team_Id));
      console.log("Team deleted");
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const TeamDetails = ({ team }) => {
    if (!team) return null;

    return (
      <div className="w-[90%] p-8 space-y-6 bg-white rounded-lg shadow-2xl mt-10">
        <div className="relative">
          <button
            onClick={() =>
              navigate("/teams/teamstask", {
                state: { teamId: team.id, team: team },
              })
            }
            className="text-blue-700 absolute top-2 left-2"
          >
            <FaExternalLinkAlt />
          </button>

          <button
            className="text-red-700 text-xl absolute top-2 right-2 "
            onClick={() => handleDeleteTeam(team.id)}
          >
            <RiDeleteBin2Line />
          </button>
        </div>

        <p className="text-xl text-center font-bold">
          Team Name: {team.teamName}
        </p>

        <div className="flex justify-around space-x-4 mt-4">
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 hover:shadow-md transition">
            <MdOutlineAdminPanelSettings className="text-3xl text-blue-500" />
            <p className="mt-2 text-lg font-semibold">Admins</p>
            <p className="text-sm text-gray-600">
              {team.admins?.length + 1 || 0} Admin(s)
            </p>
          </div>

          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 hover:shadow-md transition">
            <HiUserGroup className="text-3xl text-green-500" />
            <p className="mt-2 text-lg font-semibold">Users</p>
            <p className="text-sm text-gray-600">
              {team.users.length || 0} User(s)
            </p>
          </div>

          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 hover:shadow-md transition">
            <FaTasks className="text-3xl text-red-500" />
            <p className="mt-2 text-lg font-semibold">Tasks</p>
            <p className="text-sm text-gray-600">
              {team.tasks.length || 0} Task(s)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/teams/addteams", {
              state: { teamname: team.teamName, teamId: team.id },
            })
          }
          className="bg-black rounded-md p-2 flex text-center w-full justify-center items-center text-white hover:bg-gray-300 hover:text-black"
        >
          <MdAdd />
          Users
        </button>
      </div>
    );
  };

  return (
    <div className="flex gap-4">
      <div className="w-[60%] bg-white p-4 mx-2 mt-1 shadow-md border-2">
        <div className="rounded-lg shadow-lg p-8 space-y-2">
          <p className="text-xl text-center font-bold"> Teams</p>

          <div className="space-y-4">
            {loading ? (
              <div className="justify-center text-center ">
                <AppLoader />
              </div>
            ) : teams.length > 0 ? (
              teams.map((team) => (
                <button
                  key={team.id}
                  className={`w-full py-3 rounded-md text-sm font-semibold px-5 flex items-center transition-colors duration-200 
                    ${
                      selectedTeam?.id === team.id
                        ? "bg-gray-200 text-black border-2 border-black"
                        : "bg-black text-white hover:bg-gray-400 hover:text-black"
                    }`}
                  onClick={() => handleTeamSelect(team.id)}
                >
                  <PiMicrosoftTeamsLogoDuotone className="text-3xl text-blue-500 px-1" />
                  <p className="mr-2">Team Name: {team.teamName}</p>

                  <div className="flex gap-4 mx-auto">
                    <p className="flex items-center">
                      <HiUserGroup className="text-3xl text-yellow-500 px-1" />
                      Total Members:{" "}
                      {team.users.length + team.admins.length + 1}
                    </p>

                    <p className="flex items-center">
                      <SiGoogletasks className="text-2xl text-green-500 px-1" />
                      Total Tasks: {team.tasks.length}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-gray-600">No teams found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-[40%] mt-1">
        {selectedTeam ? (
          <TeamDetails team={selectedTeam} />
        ) : (
          <div className="w-full p-8 bg-white rounded-lg shadow-md">
            <p className="text-center text-gray-600">
              Select a team to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teamsmenu;
