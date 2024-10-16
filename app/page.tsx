"use client"

import { createDrawing, updateDrawing } from '@/scr/services/drawing-service';
import Konva from 'konva';
import React, { createElement } from 'react';
import { Stage, Layer, Line, Circle, Text, Image } from 'react-konva';
import useImage from 'use-image';



export default function Home() {
  const [tool, setTool] = React.useState('');
  const [lines, setLines] = React.useState([]);
  const [inputList, setInputList] = React.useState(null);
  const [dragBallState, setdragBallState] = React.useState({
    isDragging: false,
    x: 50,
    y: 50,
  });
  const isDrawing = React.useRef(false);
  const [firstClick, setfirstClick] = React.useState(true);
  
  const [id, setId] = React.useState('');
  const [drawings, setdrawings] = React.useState([]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const [stage, setStage] = React.useState(null);

  const handleMouseMove = (e) => {

    if(firstClick) {
      setfirstClick(false);
      setdrawings(drawings.concat(e.target.getStage()?.toJSON()));
      setStage(e.target.getStage())
      createDrawing(e.target.getStage()?.toJSON()).then((data)=>(setId(data.id)));
    }
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    //console.log(stage.toJSON())
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const BackgroundImage = () => {
    const [image] = useImage("/background.jpg");
    return <Image id="image" image={image} width={window.innerWidth/2.1} height={window.innerHeight/1.5}/>;
  };

  function addBall() {
    setInputList(<Circle 
      draggable
      onDragStart={() => {
        setdragBallState({
          isDragging: true,
        });
      }}
      onDragEnd={(e) => {
        setdragBallState({
          isDragging: false,
          x: e.target.x(),
          y: e.target.y(),
        });
        setdrawings(drawings.concat(e.target.getStage()?.toJSON()))
      }}
      x={200} y={100} radius={20} fill="orange" />); 
  }

  function play() {
      let i = 0;
      setTimeout(function run() {
        if(i<drawings.length) {
          let node = Konva.Node.create(drawings[i], "container");
          i++;
        }
        setTimeout(run, 700);
      }, 700);
  }

  return (
    <div>
      <div className='flex'>
        <div>
          <div onClick={(e)=> {addBall()}}>Ball</div>
        </div>
        <div className='w-2/4 h-2/4'>
          <Stage
            className='border-black border-2'
            
            width={window.innerWidth}
            height={window.innerHeight/1.5}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            id="container"
          >
            <Layer>
            
            <BackgroundImage/>
              
              <Circle x={90} y={100} radius={25} fill="green" 
                draggable
                onDragEnd={(e) => {
                  setdrawings(drawings.concat(e.target.getStage()?.toJSON()))
                }} 
              />
              <Circle x={200} y={300} radius={25} fill="green" 
                draggable
                onDragEnd={(e) => {
                  setdrawings(drawings.concat(e.target.getStage()?.toJSON()))
                }} 
              />
              <Circle x={408} y={370} radius={25} fill="green" 
                draggable
                onDragEnd={(e) => {
                  setdrawings(drawings.concat(e.target.getStage()?.toJSON()))
                }} 
              />
              <Circle x={616} y={300} radius={25} fill="green" 
                draggable
                onDragEnd={(e) => {
                  setdrawings(drawings.concat(e.target.getStage()?.toJSON()))
                }} 
              />
              <Circle x={726} y={100} radius={25} fill="green" 
                draggable
                onDragEnd={(e) => {
                  setdrawings(drawings.concat(e.target.getStage()?.toJSON()))
                }} 
              />
              
              {inputList}
            </Layer>
          </Stage>
        </div>
      </div>
      <button onClick={()=>{updateDrawing(drawings, id)}}>Сохранить</button>
      <button onClick={()=>{play()}}>Воспроизвести</button>
    </div>
  );
}
