"use client"

import { createDrawing, updateDrawing } from '@/src/services/drawing-service';
import Konva from 'konva';
import React from 'react';
import { Stage, Layer } from 'react-konva';
import { Draw } from '../models/draw.dto';
import { Player } from './player';
import { Ball } from './ball';
import { Moving, Step } from '../models/moving.dto';
import { Button } from './button';
import Image from 'next/image';
import { ButtonWithIcon } from './button-with-icon';
import Link from 'next/link';
import { prepare } from '../utils/bezier';

export function DrawingBoard() {
  const [firstClick, setfirstClick] = React.useState(true);
  
  const [id, setId] = React.useState(0);
  const [drawings, setDrawings] = React.useState<Step[]>([]);
  const [deletedDrawings, setDeletedDrawings] = React.useState<Step[]>([]);

  const player1 = React.useRef( null );
  const player2 = React.useRef( null );
  const player3 = React.useRef( null );
  const player4 = React.useRef( null );
  const player5 = React.useRef( null );
  const ball = React.useRef( null );
  const layer = React.useRef( null );
  const stage = React.useRef<Konva.Stage>( null );

  const mapObjects = new Map<string, React.MutableRefObject<null>>([
    ["player1", player1],
    ["player2", player2],
    ["player3", player3],
    ["player4", player4],
    ["player5", player5],
    ["ball", ball],
  ])

  const handleMouseMove = (e: any) => {
    if(firstClick) {
      setfirstClick(false);
      createDrawing(e.target.getStage()?.toJSON()).then((data)=>(setId(data.id)));
    }
  };

  function curvedMoveAnimation(node : Konva.Node, movings : Moving[], duration : number) {
    const besier = prepare(movings.length);
    const x = movings.map(_ => _.x)
    const y = movings.map(_ => _.y)
    let timeStep = 1 / duration;
    var anim = new Konva.Animation(function (frame) {
      const t = frame?.time * timeStep;
      if (1 <= t) {
        anim.stop();
        return;
      }
      node.x(besier(x, t))
      node.y(besier(y, t))
    }, layer);
    anim.start();
  }

  function applyStepAnimated(step : Step, duration : number, backward : boolean = false) {
    const node = mapObjects.get(step.objectName)?.current! as Konva.Node;
    const moving = backward ? step.steps[0] : step.steps.at(-1)
    if (step.steps.length <= 2) {
      node.to({x: moving.x, y: moving.y, duration: duration / 1000})
      return;
    }
    curvedMoveAnimation(node, backward ? step.steps.reverse() : step.steps, duration)
  }

  function play() {
    console.log(drawings)
    for(let j = 0; j<6; j++) {
      applyStepAnimated(drawings[j], 0)
    }
    let i = 6;
    setTimeout(function run() {
      if(i<drawings.length) {
        applyStepAnimated(drawings[i], 2000)
        i++;
      }
      setTimeout(run, 700);
    }, 700);      
  }

  function undo() {
    const deleted = drawings.pop()
    if(deleted) {
      setDrawings(drawings);
      setDeletedDrawings(deletedDrawings.concat(deleted));
      applyStepAnimated(deleted, 300, true)
    }
    console.log('2', drawings, deleted)
  }

  function redo() {
    const returned = deletedDrawings.shift()
    if(returned) {
      setDeletedDrawings(deletedDrawings);
      setDrawings(drawings.concat(returned));
      applyStepAnimated(returned, 300)
    }
    console.log('2',drawings, returned)
  }

  function start() {
    const str = stage.current?.getStage()?.toJSON();
    const figures = JSON.parse(str ?? '').children[0].children;
    let res : Step[] = [];
    for (const figure of figures) {
      res.push({
        objectName: figure.attrs.id,
        steps : [
          {
            x: figure.attrs.x,
            y: figure.attrs.y
          }
        ] as Moving[]
      } as Step)
    }
    drawings.length = 0;
    setDrawings(drawings.concat(res));
    console.log(res, drawings)
  }

  function clearDeleted() {
    deletedDrawings.length = 0;
    setDeletedDrawings(deletedDrawings);
  }

  return (
    <div className='m-8 p-8'>
      <div>
        <Link href={{pathname: '/strategies'}}>
          <ButtonWithIcon handleClick={() => {}} color='grey' iconSrc='/back.svg' alt='back' width={40} height={40} className='m-2' label='К стратегиям'/>
        </Link>
      </div>
      <div className='flex justify-center text-3xl'>
        Name
      </div>
      <div className='flex justify-between'>
        <div className='bg-orange-400 p-6 m-6 mx-10 rounded-3xl flex flex-col justify-evenly items-center'>
            <ButtonWithIcon handleClick={() => start()} iconSrc='/start.svg' alt='start' width={60} height={60} disabled={false}/>
            <ButtonWithIcon handleClick={() => undo()} iconSrc='/undo.svg' alt='undo' width={53} height={53} disabled={drawings.length<7}/>
            <ButtonWithIcon handleClick={() => redo()} iconSrc='/undo.svg' alt='redo' width={53} height={53} className='-scale-x-100' disabled={deletedDrawings.length===0}/>
            <ButtonWithIcon handleClick={() => play()} iconSrc='/play.svg' alt='play' width={40} height={40} className='m-2'/>
            <ButtonWithIcon handleClick={() => {}} iconSrc='/comment.svg' alt='add comment' width={53} height={53}/>
        </div>
        <div className='m-6 mx-10'>
          <Stage
            className='border-black border-2 '
            style={{ backgroundImage: `url(/background.jpg)`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}
            width={window.innerWidth*0.75 - 50}
            height={window.innerHeight*0.73 - 100}
            onMousemove={handleMouseMove}
            id="container"
            ref={stage}
          >
            <Layer ref={layer}>
              <Player innerRef={player1} id={'player1'} x={90} y={100} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()}/>
              <Player innerRef={player2} id={'player2'} x={200} y={300} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()}/>
              <Player innerRef={player3} id={'player3'} x={408} y={370} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()}/>
              <Player innerRef={player4} id={'player4'} x={616} y={300} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()}/>
              <Player innerRef={player5} id={'player5'} x={726} y={100} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()}/>
              <Ball innerRef={ball} id={'ball'} x={90} y={100} drawings={drawings} setDrawings={setDrawings} additionFunc={()=>clearDeleted()}/>
            </Layer>
          </Stage>
        </div>
      </div>
      <div className='flex items-center justify-end'>
        <Button clickHandler={()=>{updateDrawing({data:drawings, id, name: 'aboba'} as Draw)}} label='Сохранить' color='orange'/>
        <Button clickHandler={()=>{}} label='Отмена'/>
      </div>
    </div>
  );
}
