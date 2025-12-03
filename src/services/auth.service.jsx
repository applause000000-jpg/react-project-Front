import axios from "axios";
import {BASE_API_URL} from "../common/constants";

const BASE_URL = BASE_API_URL+'/api/authentication';

const loginService = (user)=>{
  return axios.post(BASE_URL+'/sign-in',user);
}
const registerService = (user)=>{
  return axios.post(BASE_URL+'/sign-up',user);
}

export{loginService,registerService}