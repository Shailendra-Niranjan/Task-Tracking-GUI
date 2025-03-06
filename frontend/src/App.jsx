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
import TeamsSubTask from './pages/TeamsSubTask'
import ChatPage from './pages/ChatPage'
import ChatGroup from './pages/ChatGroup'
import ErrorPage from './pages/BadURLS'
import ProtectedRoute from './context/ProtectedRoute';
import { AuthProvider } from './context/AuthContext' 


function App() {

  return (
    <> 
      <AuthProvider>
       <Routes>
          <Route  index element={<Home/>}/>
          <Route path='/signup' element={<SignUpPage/>} />
          <Route path='/login' element={<Login/>}/>

          {/* Protected Routes */}
          <Route path="/tasks" element={<ProtectedRoute element={<Taskpage />} />} />
          <Route path="/subtasks/:taskName/:id/:teamId" element={<ProtectedRoute element={<SubTaskPage />} />} />
          <Route path="/otpvalidate" element={<ProtectedRoute element={<EmailVerification />} />} />
          <Route path="/teams" element={<ProtectedRoute element={<Teamspage />} />} />
          <Route path="/teams/addteams" element={<ProtectedRoute element={<Teamform />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />
          <Route path="/teams/teamstask" element={<ProtectedRoute element={<Teamstask />} />} />
          <Route path="/teams/teamstask/chats" element={<ProtectedRoute element={<ChatPage />} />} />
          <Route path="/teams/task/subtask" element={<ProtectedRoute element={<TeamsSubTask />} />} />
          <Route path="/teams/teamstask/chatgroup" element={<ProtectedRoute element={<ChatGroup />} />} />

          {/* Error route */}
          <Route path='*' element={<ErrorPage />}/>
       </Routes>
       </AuthProvider>
     </>
  )
}

export default App
