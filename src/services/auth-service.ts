import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "../models/user.dto";
import { backendUrl } from "./drawing-service";
import { toast } from 'react-toastify';

export function register(name: string, email: string, password: string, router: AppRouterInstance) {
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
      if(data.status === 200) {
        router.push('/strategies');
      }else if(data.status === 400) {
        router.push('/login');
        toast.error('Аккаунт с такой почтой уже существует, войдите', {
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

export function login(email: string, password: string, router: AppRouterInstance) {
    return fetch(backendUrl + 'auth/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password}),
        credentials: 'include'
    })
    .then((data)=>{
      if(data.status === 200) {
        router.push('/strategies');
      } if(data.status === 401) {
        toast.error('Проверьте введенные данные или зарегистрируйтесь', {
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

export function logout(router: AppRouterInstance) {
  return fetch(backendUrl + 'auth/logout', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
  })
  .then((data)=>{
    if(data.status === 200) {
      router.push("/login");
      toast.success('Вы вышли из аккаунта', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if(data.status === 500) {
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
    }
    return data;
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