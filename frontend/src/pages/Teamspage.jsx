import { IoMdAdd } from "react-icons/io";
import Teamsmenu from "../components/Teamsmenu";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast , ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css'



const Teamspage = () => {
    const navigate = useNavigate();

    const showToast = () => toast.success('Deleted Successfully!')
    
       return(
        <>
            <NavBar />

            <div className="    mt-5">
            <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 px-8 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Teams 
              </h1>
            </div>
            </div>
        

       
            <div className="flex justify-end items-center mt-3 mx-6">
            <button 
                type="buton" 
                className="bg-black text-white rounded-lg px-4 py-2 flex items-center gap-2 border-2 border-black shadow-md hover:bg-white hover:text-black transition-all duration-300"
                onClick={ () => navigate("/teams/addteams")}
                >
                <IoMdAdd className="inline-block text-xl " /> Add Teams
            </button>
            </div>
            </div>

            <div className="flex-row m-5 mx-7">
                <Teamsmenu toast={() => showToast()} />
            </div>

            <ToastContainer position="top-right"  autoClose={3000}/>
        
        </>
    )
}

export default Teamspage;