import React from "react";
import NavBar from "../components/NavBar";
import SubTaskMenu from "../components/SubTaskMenu";

const SubTaskPage = () => {
  return (
    <>
      <NavBar />
       
       <h1 className="text-center mt-4 text-4xl font-bold">Subtask Page</h1>

      <div className="flex flex-row m-4">
        <SubTaskMenu />
        
      </div>
    </>
  );
};

export default SubTaskPage;