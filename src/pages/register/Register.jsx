import { useEffect, useState } from "react";
import User from "../../models/User";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Register.css"
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { registerService } from "../../Services/auth.service";

function Register(){
  const [user,setUser]=useState(new User('','',''))
  const navigate=useNavigate()
  const [loading,setLoading]=useState(false);
  const [submitted,setSubmitted]=useState('');
  const [errorMessage, setErrorMessage]=useState('');

  const currentUser=useUserStore((state)=>state.user)

  
  useEffect(()=>{
    if(currentUser?.id){
      navigate('/home');
    }
  },[]);

  const handleRegister=(e)=>{
    e.preventDefault();
    setSubmitted(true)
    if(!user.username || !user.password || !user.name){
      return;
    }
    setLoading(true);
    registerService(user)
    .then(()=>{
      navigate('/login');
    })
    .catch((error)=>{
      console.log(error);
      if(error?.response?.status==409){
        setErrorMessage("같은 유저네임이 있음")
      }else{
        setErrorMessage("에러 발생")
      }
    })
  }
  const handleChange=(e)=>{
    const {name, value}=e.target;
    setUser((prevState)=>{
      return{
        ...prevState,
        [name]:value,
      }
    })
  }
  return(
    <div className="container mt-5">
      <div className="card ms-auto me-auto p-3 shadow-lg custom-card">
        <FontAwesomeIcon icon={faUserCircle} className="ms-auto me-auto user-icon"/>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleRegister} noValidate className={submitted?'was-validated':''}>
          <label htmlFor="name">이 름</label>
          <input type="text" name="name" className="form-control"
          placeholder="name" value={user.name}
          onChange={handleChange}
          required/>
          <div className="invalid-feedback">이름을 입력</div>

          <label htmlFor="name">유저네임</label>
          <input type="text" name="username" className="form-control"
          placeholder="username" value={user.username}
          onChange={handleChange}
          required/>
          <div className="invalid-feedback">유저네임을 입력</div>
          <label htmlFor="name">패스워드</label>
          <input type="password" name="password" className="form-control"
          placeholder="password" value={user.password}
          onChange={handleChange}
          required/>
          <div className="invalid-feedback">패스워드를 입력</div>
          <label htmlFor="name">E-mail</label>
          <input type="email" name="email" className="form-control"
          placeholder="E-mail" value={user.email}
          onChange={handleChange}
          required/>
          <div className="invalid-feedback">이메일을 입력</div>
          <button className="btn btn-info text-white w-100 mt-3" disabled={loading}>
            가입
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register;