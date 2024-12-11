import { useState } from 'react'
import {Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SignUpPage from './pages/SignUpPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
       <Routes>
          <Route  index element={<Home/>}/>
          <Route path='/signup' element={<SignUpPage/>}/>
          {/* <Route path='/login' element={<LoginPage/>}/> */}
          <Route  />
       </Routes>
     </>
  )
}

export default App
