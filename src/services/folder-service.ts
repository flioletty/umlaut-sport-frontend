import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Folder } from "../models/folder.dto";
import { backendUrl } from "./drawing-service";

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