import { start } from "repl";
import { Draw } from "../models/draw.dto";

const backendUrl = 'http://83.166.236.130:8000/api/v1/'

export function createDrawing(name: string) {
    return fetch(backendUrl + 'draw', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name})
    })
    .then((result)=>result.json())
    .then((json)=>{
      return {
        name: json.name,
        id: json.id,
        data: json.data,
        start: json.start
      } as Draw;
    });
}


export function updateDrawing(data: Draw) {
    return fetch(backendUrl + 'draw', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data, 
          data: '['+data.data?.map((el)=>{return `{objectName:${el.objectName}, steps:[${
            el.steps.map((step)=>`{x:${step.x}, y:${step.y}}`)
          }]}]`}).toString()+']', 
          start: '['+data.start?.map((el)=>{return `{objectName:${el.objectName}, steps:[${
            el.steps.map((step)=>`{x:${step.x}, y:${step.y}}`)
          }]}`}).toString()+']', 
        })
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
        return {
          name: json.name,
          id: json.id,
          data: json.data,
          start: json.start
        } as Draw;
      });
}

export function getAllDrawing() {
    return fetch(backendUrl + 'draw', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
    }).then((result)=>result.json());
}
