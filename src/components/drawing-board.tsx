"use client"

import { createDrawing, updateDrawing } from '@/src/services/drawing-service';
import Konva from 'konva';
import React from 'react';
import { Stage, Layer } from 'react-konva';
import { Draw } from '../models/draw.dto';
import { Player } from './player';
import { Ball } from './ball';
import { Moving } from '../models/moving.dto';

export function DrawingBoard() {
  const [firstClick, setfirstClick] = React.useState(true);
  
  const [id, setId] = React.useState(0);
  const [drawings, setDrawings] = React.useState<Moving[]>([]);

  const player1 = React.useRef( null );
  const player2 = React.useRef( null );
  const player3 = React.useRef( null );
  const player4 = React.useRef( null );
  const player5 = React.useRef( null );
  const ball = React.useRef( null );
  const layer = React.useRef( null );

  const mapObjects = new Map<string, React.MutableRefObject<null>>([
    ["player1", player1],
    ["player2", player2],
    ["player3", player3],
    ["player4", player4],
    ["player5", player5],
    ["ball", ball],
  ])

  const handleMouseMove = (e) => {
    if(firstClick) {
      setfirstClick(false);
      createDrawing(e.target.getStage()?.toJSON()).then((data)=>(setId(data.id)));
    }
  };

  function play() {
      let i = 0;
      setTimeout(function run() {
        if(i<drawings.length) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          const node = mapObjects.get(drawings[i].objectName)?.current! as Konva.Node;

          console.log(node)
          node.to({x: drawings[i].x, y: drawings[i].y, duration: 0.3});
          i++;
        }
        setTimeout(run, 700);
      }, 700);
        
      
  }

  return (
    <div>
      <div className='flex'>
        <div>
          <div >Ball</div>
        </div>
        <div className='w-2/4 h-2/4'>
          <Stage
            className='border-black border-2'
            style={{ backgroundImage: `url(/background.jpg)`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}
            width={window.innerWidth}
            height={window.innerHeight/1.5}
            onMousemove={handleMouseMove}
            id="container"
          >
            <Layer ref={layer}>
            
              <Player innerRef={player1} id={'player1'} x={90} y={100} drawings={drawings} setDrawings={setDrawings}/>
              <Player innerRef={player2} id={'player2'} x={200} y={300} drawings={drawings} setDrawings={setDrawings}/>
              <Player innerRef={player3} id={'player3'} x={408} y={370} drawings={drawings} setDrawings={setDrawings}/>
              <Player innerRef={player4} id={'player4'} x={616} y={300} drawings={drawings} setDrawings={setDrawings}/>
              <Player innerRef={player5} id={'player5'} x={726} y={100} drawings={drawings} setDrawings={setDrawings}/>
              <Ball innerRef={ball} id={'ball'} x={90} y={100} drawings={drawings} setDrawings={setDrawings}/>
              
            </Layer>
          </Stage>
        </div>
      </div>
      <button onClick={()=>{updateDrawing({data:drawings, id, name: 'aboba'} as Draw)}}>Сохранить</button>
      <button onClick={()=>{play()}}>Воспроизвести</button>
    </div>
  );
}
