const backendUrl = 'http://83.166.236.130:8000/api/v1/'

export function createDrawing(data) {
    return fetch(backendUrl + 'draw', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: 'aboba', data: data})
    }).then((result)=>result.json());
}


export function updateDrawing(data, id) {
    return fetch(backendUrl + 'draw', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: 'aboba', data: data.toString(), id: id})
    });
}

export function getDrawingById(id) {
    return fetch(backendUrl + 'draw/' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
    }).then((result)=>result.json());
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
