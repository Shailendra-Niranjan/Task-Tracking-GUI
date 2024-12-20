import Login from './pages/Login'
import {Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SignUpPage from './pages/SignUpPage'
import Taskpage from './pages/Taskpage'
import SubTaskPage from './pages/SubTaskPage'

function App() {

  return (
    <> 
       <Routes>
          <Route  index element={<Home/>}/>
          <Route path='/signup' element={<SignUpPage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/tasks' element={<Taskpage />} />
          <Route path='/subtasks/:taskName/:description' element={<SubTaskPage />} />
          <Route  />
       </Routes>
     </>
  )
}

export default App
