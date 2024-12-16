import React , {useState} from "react";
import SubTaskMenu from "../components/SubTaskMenu"



const Teamsmenu = () => {

    const [teamItems,setTeamItems] = useState([

        { id: "1", teamName : "Bajrang Coders" , teamUsers : "5" , teamTask : "5"},
        { id: "2", teamName : "Alpha Groups" , teamUsers : "9" , teamTask : "15"},
        { id: "3", teamName : "Adnai Inters" , teamUsers : "10" , teamTask : "25"},
        { id: "4", teamName : "Ambani & Sons" , teamUsers : "7" , teamTask : "8"},
        { id: "5", teamName : "Creative Coders" , teamUsers : "3" , teamTask : "9"},
        
      ])
        
     
      return (
        <>
        <div className="w-[60%] flex items-center justify-left bg-white p-4 mx-2 mt-1 h-auto shadow-md border-2">
          <div className="w-full rounded-lg shadow-lg p-8 space-y-2 ">
            <p className="text-xl text-center font-bold">YOUR Teams</p>
            <div className="space-y-4  ">
              {teamItems.map((teams) => (
                <div key={teams.id} 
                className="w-full bg-black text-white py-3 rounded-md text-sm font-semibold px-5 flex"
                >
                  Team Name : <p> {teams.teamName}</p>
                 <p className="mx-auto">Total Members :{teams.teamUsers}</p>
                  Total Tasks : <p>{teams.teamTask}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </>
      )
}

export default Teamsmenu;