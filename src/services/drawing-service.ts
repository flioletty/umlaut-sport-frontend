import { Draw } from "../models/draw.dto";

export const backendUrl = 'http://83.166.236.130:8000/api/v1/'

export function createDrawing(name: string, folderId: number | string, area: string | number) {
    const folder_id = Number(folderId)
    return fetch(backendUrl + 'draw', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name, folder_id: folder_id, area: area})
    })
    .then((result)=>result.json())
    .then((json)=>{
      return json as Draw;
    });
}


export function updateDrawing(data: Draw) {
    return fetch(backendUrl + 'draw', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export function getDrawingById(id: number) {
    return fetch(backendUrl + 'draw/' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((result)=>result.json())
      .then((json)=>{
        return json as Draw;
      });
}

export function getAllDrawing() {
    return fetch(backendUrl + 'draws', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
    }).then((result)=>result.json()
    .then((json)=>{
      return json as Draw[];
    })
  );
}
