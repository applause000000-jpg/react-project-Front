
import { Route, Routes } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './pages/home/home'
import Login from './pages/login/Login'
import Navbar from './components/Navbar'
import Register from './pages/register/Register'
function App() {


  return (
    <div>
      <Navbar/>
    <div>
      <Routes>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
      </Routes>
    </div>
    </div>
  )
}

export default App
