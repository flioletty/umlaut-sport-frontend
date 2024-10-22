import { Draw } from "../models/draw.dto";

const backendUrl = 'http://83.166.236.130:8000/api/v1/'

export function createDrawing(name: string) {
    // return fetch(backendUrl + 'draw', {
    //     method: 'POST',
    //     mode: 'cors',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({name: name})
    // })
    // .then((result)=>result.json())
    // .then((json)=>{
    //   return {
    //     name: json.name,
    //     id: json.id,
    //     data: json.data,
    //     start: json.start
    //   } as Draw;
    // });
    return {
          name: 'json.name',
          id: 1,
          data: [],
          start: []
        } as Draw;
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
          data: JSON.stringify(data.data), 
          start: JSON.stringify(data.start), 
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
          data: JSON.parse(json.data),
          start: JSON.parse(json.start),
        } as Draw;
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
      console.log(json)
      for(let draw of json) {
        draw.start = JSON.parse(draw.start);
        draw.data = JSON.parse(draw.data);
      }
      console.log(json)
      return json as Draw[];
    })
  );
}
