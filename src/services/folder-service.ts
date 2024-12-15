import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Folder } from "../models/folder.dto";
import { backendUrl } from "./drawing-service";
import { toast } from "react-toastify";

export function getAllFolders(router: AppRouterInstance) {
    return fetch(backendUrl + 'folders', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then((data) => {
      if(data.status === 401) {
        router.push('/login');
      }
      return data;
    })
    .then((result)=>result.json()
    .then((json)=>{
      return json as Folder[];
    })
  );
}

export function createFolder(name: string, router: AppRouterInstance) {
    return fetch(backendUrl + 'folder', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name}),
        credentials: 'include'
    })
    .then((data) => {
      if(data.status === 401) {
        router.push('/login');
      }
      return data;
    })
    .then((result)=>result.json())
    .then((json)=>{
      return json as Folder;
    });
}

export function shareFolder(email: string, id: number, router: AppRouterInstance) {
  return fetch(backendUrl + 'folder/access', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, id, role: 0}),
      credentials: 'include'
  })
  .then((data) => {
    if(data.status === 401) {
      router.push('/login');
    } else if(data.status === 404) {
      toast.error('Пользователь с такой почтой еще не зарегистрирован', {
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
}