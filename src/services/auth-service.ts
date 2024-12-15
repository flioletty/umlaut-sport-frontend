import { User } from "../models/user.dto";
import { backendUrl } from "./drawing-service";
import { toast } from 'react-toastify';

export function register(name: string, email: string, password: string) {
    return fetch(backendUrl + 'auth/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: name, email: email, password: password}),
        credentials: 'include'
    })
    .then((data)=> {
      if(data.status === 400) {
        toast.error('Проверьте входные данные или зарегистрируйтесь, если еще этого не сделали', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      return data;
    })
    .then((result)=>result.json())
    .then((json)=>{
      return json.user as User;
    })
    .catch(()=>{
      toast.error('Произошла ошибка на нашей стороне. Повторите попытку позже', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        return null;
    })
}

export function login(email: string, password: string) {
    return fetch(backendUrl + 'auth/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password}),
        credentials: 'include'
    })
    .then((result)=>result.json())
    .then((json)=>{
      return json.user as User;
    })
    .catch(()=>{
      toast.error('Произошла ошибка на нашей стороне. Повторите попытку позже', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        return null;
    })
}