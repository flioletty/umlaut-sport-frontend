import { Folder } from "../models/folder.dto";
import { backendUrl } from "./drawing-service";

export function getAllFolders() {
    return fetch(backendUrl + 'folders', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
    }).then((result)=>result.json()
    .then((json)=>{
      return json as Folder[];
    })
  );
}

export function createFolder(name: string) {
    return fetch(backendUrl + 'folder', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name})
    })
    .then((result)=>result.json())
    .then((json)=>{
      return json as Folder;
    });
}