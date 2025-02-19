import { useState } from "react"
import { motion } from "framer-motion"
import NavBar from "./NavBar"
import Apploader from "./App-Loader"
import { UserIcon, UserGroupIcon, ShieldCheckIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/ReactToastify.css'
import {  useLocation, useNavigate } from "react-router-dom"

const Teamform = () => {

    const navigate = useNavigate()
    const  location = useLocation();

    
    if(location.state?.team){
      var {team} = location.state ;
      var TECHLEAD = team.techLead?.email ;
      var teamId = team.id;
      var TEAMNAME = team.teamName;
      var TEAMDESC = team.description;
    }else{
      var { team }= false;
      var TEAMNAME= '';
      var TEAMDESC= '';
      var TECHLEAD= false;
    }

   
   
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [teachLeadEmail, setTeachLeadEmail] = useState("")
  const [teachLeadName, setTeachLeadName] = useState("")
  const [developerEmail, setDeveloperEmail] = useState("")
  const [developerName, setDeveloperName] = useState("")
  const [QAEmail, setQAEmail] = useState("")
  const [QAName, setQAName] = useState("")
  const [techResult, setTechResult] = useState([])
  const [devResult, setDevResult] = useState([])
  const [QAResult, setQAResult] = useState([])
  const [techloading, setTechLoading] = useState(false)
  const [devloading, setDevLoading] = useState(false)
  const [QAloading, setQALoading] = useState(false)
  const [error, setError] = useState(null)

  const [techLead, setTechLead] = useState("")
  const [developers, setDevelopers] = useState([])
  const [QA, setQA] = useState([])

  const token = sessionStorage.getItem("token")

const fetchData = async (endpoint, options) => {
    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
    }

    const headers =
      options?.body instanceof FormData
        ? { ...defaultHeaders, ...options?.headers }
        : {
            ...defaultHeaders,
             "Content-Type": "application/json",
            ...options?.headers,
          }

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers,
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

  const handleSearch = async (type, value, setLoading, setResult) => {
    setLoading(true)
    const searchParams = new URLSearchParams({
      name: type === "name" ? value : "",
      email: type === "email" ? value : "",
    })

    if(teamId){
      searchParams.append("teamId",teamId)
    }
    try {
      const data = await fetchData(`/team/getUserForTeam?${searchParams}`, {
        method: "GET",
      })
      setResult(data)
    } 
    catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTeachLeadSearch = (type, value) => {
    if (type === "name") setTeachLeadName(value)
    else setTeachLeadEmail(value)
    handleSearch(type, value, setTechLoading, setTechResult)
  }

  const handleDevSearch = (type, value) => {
    if (type === "name") setDeveloperName(value)
    else setDeveloperEmail(value)
    handleSearch(type, value, setDevLoading, setDevResult)
  }

  const handleQASearch = (type, value) => {
    if (type === "name") setQAName(value)
    else setQAEmail(value)
    handleSearch(type, value, setQALoading, setQAResult)
  }

  
  const validEmail = (type,email)=>{
    
    const techLeadCheck = techLead.length > 0  ? email == techLead  : false ;
    const devCheck = developers.some( (ele)  => ele == email);
    const qaCheck = QA.some( (ele)  => ele == email);
    
    if(!techLeadCheck && !devCheck && !qaCheck ){
      if(type == 'tech'){
        setTechLead(email);
      }
      else if(type == 'devs'){
        setDevelopers( (prev) => [...prev,email] ) 
      }
      else{
        setQA( (prev) => [...prev,email] )
      }
    }
    else{
      if(techLeadCheck){
        toast.error('already in Tech')
      }
      else if(devCheck){
        toast.error('already in Dev')
      }
      else{
        toast.error('already in QA')
      }
    }

  }

  const handleTech = (member) => {
  validEmail("tech",member);
  }
  const handleDevs  = (member) => {
  validEmail("devs",member);
  }
  const handleQA = (member) =>{
      validEmail("qa",member);
  } 

  const handleCreateTeam = () => {
    const payload = {
      teamName : teamName,
      desc : teamDescription,
      techLead : techLead,
      devs : developers,
      qaDevs : QA
    }
    if(teamId){
      const formdata = new FormData();
      formdata.append('teamId',teamId)

      if(TECHLEAD){
        formdata.append('techLead', TECHLEAD);
      }
      else{
        formdata.append('techLead', techLead);
      }
      formdata.append('devs', developers)
      formdata.append('qaDevs' , QA)

      const response  = fetchData(`/team/addUserInTeamReq`,{
        method : 'POST',
        body : formdata
      })
      if(response){
        toast.success('Team Created!')
        setTimeout( () => navigate('/teams') ,2000)
      }
    }
    else{
      const response  = fetchData(`/team/creations`,{
        method : 'POST',
        body : JSON.stringify(payload)
      })
      if(response){
        toast.success('Team Created!')
        setTimeout( () => navigate('/teams') ,2000)
      }
    }
  }

  const TeamMemberSection = ({
    title,
    icon,
    nameValue,
    emailValue,
    onNameChange,
    onEmailChange,
    loading,
    results,
    onSelect,
    selected,
    onRemove,
  }) => (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 text-xl font-semibold text-gray-700">
        {icon}
        <h2>{title}</h2>
      </div>
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search by name"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={nameValue}
          onChange={(e) => onNameChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by email"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={emailValue}
          onChange={(e) => onEmailChange("email", e.target.value)}
        />
      </div>
      <div className="max-h-40 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <Apploader />
          </div>
        ) : (
          results.map((user, index) => (
            <motion.button
              key={index}
              className="w-full p-2 text-left hover:bg-gray-100 transition duration-150 ease-in-out"
              onClick={() => onSelect(user.email)}
              whileHover={{ backgroundColor: "#f3f4f6" }}
            >
              {user.name}
            </motion.button>
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(selected)
          ? selected.map((member, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                {member}
                <button onClick={() => onRemove(member)} className="ml-2 focus:outline-none">
                  <XCircleIcon className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            ))
          : selected && (
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                {selected}
                <button onClick={() => onRemove(selected)} className="ml-2 focus:outline-none">
                  <XCircleIcon className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <ToastContainer position="top-right"  autoClose={1000} />
      
      <div className="mt-5">
      <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 px-8 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">
              {TEAMNAME ? 'Add User'  : 'Create Team'} 
              </h1>
            </div>
        </div>
      </div>
      <div className="container mx-auto px-2 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        > 
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <input
                type="text"
                placeholder="Enter team name"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={ TEAMNAME.length > 0 ? TEAMNAME :  teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <textarea
                name="team-description"
                placeholder="Team description"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={ TEAMDESC.length > 0 ? TEAMDESC : teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                rows="4"
              ></textarea>
            </div>

          {TECHLEAD ? 
              <p
              className="w-full p-2 border bg-gray-300 border-gray-300 rounded-md text-xl text-center"
              >Team Lead alreday selected</p>
              :
              (<TeamMemberSection
              title="Tech Lead"
              icon={<UserIcon className="h-6 w-6 text-blue-500" />}
              nameValue={teachLeadName}
              emailValue={teachLeadEmail}
              onNameChange={handleTeachLeadSearch}
              onEmailChange={handleTeachLeadSearch}
              loading={techloading}
              results={techResult}
              onSelect={handleTech}
              selected={TECHLEAD ? TECHLEAD : techLead}
              onRemove={() => setTechLead("")}
            />)
          }

            <TeamMemberSection
              title="Developers"
              icon={<UserGroupIcon className="h-6 w-6 text-green-500" />}
              nameValue={developerName}
              emailValue={developerEmail}
              onNameChange={handleDevSearch}
              onEmailChange={handleDevSearch}
              loading={devloading}
              results={devResult}
              onSelect={handleDevs}
              selected={developers}
              onRemove={(member) => setDevelopers(developers.filter((dev) => dev !== member))}
            />

            <TeamMemberSection
              title="QA"
              icon={<ShieldCheckIcon className="h-6 w-6 text-purple-500" />}
              nameValue={QAName}
              emailValue={QAEmail}
              onNameChange={handleQASearch}
              onEmailChange={handleQASearch}
              loading={QAloading}
              results={QAResult}
              onSelect={handleQA}
              selected={QA}
              onRemove={(member) => setQA(QA.filter((qa) => qa !== member))}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className= {`${ teamName && teamDescription
                ?  "bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
              } w-full py-3 px-4 text-white font-semibold
                         rounded-lg shadow-md`}
              onClick={handleCreateTeam}
              disabled={team ? false :  !teamName || !teamDescription }
            >
            {TEAMNAME ? 'Add user' :  'Create Team' }
            </motion.button>
          </div>
        </motion.div>
        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </div>
  )
}

export default Teamform

