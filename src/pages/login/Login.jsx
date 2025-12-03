import { useEffect, useState } from "react";
import User from "../../models/User";
import { Link, useNavigate } from "react-router-dom";
import useUserStore, { SET_CURRENT_USER } from "../../store/useUserStore";
import { loginService } from "../../Services/auth.service";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Login.css"
function Login(){
  const [user,setUser]=useState(new User('','',''));
  const [loading,setLoading]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const [errorMessage, setErrorMessage]=useState('');
  const navigate=useNavigate()

  const currentUser=useUserStore((state)=>state.user)
  useEffect(()=>{
    if(currentUser?.id)
      navigate('/home')
  })
  const handleChange =(e)=>{
    const{name,value}=e.target;
    setUser((prevState)=>{
      return{
        ...prevState,
        [name]:value,
      }
    })
  }
  const setCurrentUser=useUserStore((state)=>state.setCurrentUser);
  const handleLogin=(e)=>{
    e.preventDefault();
    setSubmitted(true);

    if(!user.username || !user.password){
      return;
    }
    setLoading(true);
    loginService(user)
    .then((response)=>{
      setCurrentUser(response.data)
      navigate('/home')
    })
    .catch((error)=>{
      console.log(error);
      setErrorMessage("유저네임 또는 패스워드가 틀림")
      setLoading(false);
    })
  }

  return(
    <div className="container mt-5">
      <div className="card ms-auto me-auto p-3 shadow-lg custom-card">
        <FontAwesomeIcon icon={faUserCircle} className="ms-auto me-auto user-icon"/>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleLogin} noValidate className={submitted?'was-validated':''}>
          <div className="form-group my-2">
            <label htmlFor="name">유저네임</label>
          <input type="text" name="username" className="form-control"
          placeholder="username" value={user.username}
          onChange={handleChange}
          required/>
          <div className="invalid-feedback">유저네임을 입력</div>
          </div>


          <div className="form-group my-2">
            <label htmlFor="name">패스워드</label>
            <input type="password" name="password" className="form-control"
            placeholder="password" value={user.password}
            onChange={handleChange}
            required/>
            <div className="invalid-feedback">패스워드를 입력</div>
          </div>
          <button className="btn btn-info text-white w-100 mt-3" disabled={loading}>
            로그인
          </button>
          
        </form>
        <Link to="/register" className="btn btn-link" style={{color:'darkgray'}}>
          새 계정 만들기
        </Link>
      </div>
    </div>
  )
}

export default Login;