"use client"

import React, { createElement } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';



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

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
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

  function addBall() {
    setInputList(<Circle draggable
      fill={dragBallState.isDragging ? 'green' : 'black'}
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
      }} x={200} y={100} radius={50} fill="orange" />); 
  }

  return (
    <div>
      <div className='flex'>
        <div>
          <div onClick={(e) => {setTool('pen')}}>Pen</div>
          <div onClick={(e) => {setTool('eraser')}}>Eraser</div>
          <div onClick={(e)=> {addBall()}}>Ball</div>
          <div>Player</div>
        </div>
        <div className='w-2/4 h-2/4'>
          <Stage
            className='border-black border-2'
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#df4b26"
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === 'pen' ? 'source-over' : ''
                  }
                />
              ))}
              {inputList}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
