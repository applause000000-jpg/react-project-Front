
import { Route, Routes } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './pages/home/home'
import Login from './pages/login/Login'
import Navbar from './components/Navbar'
import Register from './pages/register/Register'
import CalendarPage from './pages/calendar/CalendarPage'
function App() {


  return (
    <div>
      <Navbar/>
    <div className='contents'>
      <Routes>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/calendar' element={<CalendarPage/>}></Route>
      </Routes>
    </div>
    </div>
  )
}

export default App
