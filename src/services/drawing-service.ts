import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Draw } from "../models/draw.dto";
import { toast } from 'react-toastify';

export const backendUrl = 'http://83.166.236.130:8000/api/v1/'

export function createDrawing(name: string, folderId: number | string, area: string | number, router: AppRouterInstance) {
    const folder_id = Number(folderId)
    return fetch(backendUrl + 'draw', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name, folder_id: folder_id, area: area}),
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
      return json as Draw;
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


export function updateDrawing(data: Draw, router: AppRouterInstance) {
    return fetch(backendUrl + 'draw', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then((data)=>{
      if(data.status === 200) {
          toast.success('Успешно сохранено!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
      } else if(data.status === 400) {
          toast.error('Проверьте, действительно ли вы нарисовали стратегию и введено ли название стратегии', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else if(data.status === 401) {
          toast.error('Ошибка входа, повторите попытку', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          router.push('/login');
        } else {
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
    })
}

export function getDrawingById(id: number, router: AppRouterInstance) {
  return fetch(backendUrl + 'draw/' + id, {
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
    .then((result)=>result.json())
    .then((json)=>{
      return json as Draw;
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
        return undefined;
    })
}

export function getAllDrawing(router: AppRouterInstance) {
  return fetch(backendUrl + 'draws', {
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
      return json as Draw[];
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
        return undefined;
    })
  );
}
