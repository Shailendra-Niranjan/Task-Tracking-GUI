import Login from './pages/Login'
import {Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SignUpPage from './pages/SignUpPage'
import Taskpage from './pages/Taskpage'
import SubTaskPage from './pages/SubTaskPage'
import Teamspage from './pages/Teamspage'
import Teamform from './components/Teamform'
import EmailVerification from './pages/EmailVerification';
import Teamstask from './pages/Teamstask'
import Profile from './pages/Profile'
import Notifications from './pages/NotificationPage'


function App() {

  return (
    <> 
       <Routes>
          <Route  index element={<Home/>}/>
          <Route path='/signup' element={<SignUpPage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/tasks' element={<Taskpage />} />
          <Route path='/teams' element={<Teamspage />} />
          <Route path='/subtasks/:taskName/:description' element={<SubTaskPage />} />
          <Route path='/otpvalidate' element={<EmailVerification />} />
          <Route path='/teams/addteams' element={<Teamform />} />
          <Route path='/teams/teamstask' element={<Teamstask />} />
          <Route path='/profile' element={<Profile/>} />
          <Route path="/notifications" element={<Notifications />} />
          <Route  />
       </Routes>
     </>
  )
}

export default App
