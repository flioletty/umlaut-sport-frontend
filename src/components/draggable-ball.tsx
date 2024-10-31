/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Image } from "react-konva"
import { DraggableThingProps } from "../models/props.models"
import React, { useEffect } from "react";
import { Step, Moving } from "../models/moving.dto";
import useImage from "use-image";
import { EditableText } from "./editable-text";
import { StartLabels } from "../models/start-labels";
import Konva from "konva";

export function DraggableBall({drawings, setDrawings, x, y, src, id, innerRef, additionFunc = () => {}, disabled, ballRef} : DraggableThingProps) {
    
    const [steps, setSteps] = React.useState<Moving[]>([]);
    const [text, setText] = React.useState(StartLabels.get(id) ?? id);
    const [ball, setBall] = React.useState(false);

    console.log(ballRef)
    
    useEffect(()=>{setText(StartLabels.get(id) ?? id)}, [StartLabels.get(id), id])
  
    function getPositionFromStage(stage: any) {
        const circle = stage.getLayers()[0].findOne(`#${id}`)
        return {x: circle.attrs.x, y: circle.attrs.y} as Moving
    }

    const [image] = useImage(src);

    function Ball() {
        return ((ballRef?.current)
        )
    }

    return(
        <Group x={x} y={y} id={id}
            name={text}
            ref={innerRef}
                draggable
                onDragEnd={() => {
                    const step = {objectName: id, steps: [...steps].filter((el, ind)=>ind%8===0), label: text} as Step
                    setDrawings(drawings.concat(step))
                    console.log(drawings)
                    additionFunc();
                }} 
                onDragMove={ (e) => {
                            const position = getPositionFromStage(e.target.getStage())
                            setSteps(steps.concat(position))
                    }
                } 
                onDragStart={(e) => {
                    steps.length = 0
                    setSteps(steps)
                    const position = getPositionFromStage(e.target.getStage())
                    setSteps(steps.concat(position))
                }}
                onDblClick={()=>{
                    if(innerRef)
                        (innerRef?.current as Konva.Group).add(ballRef?.current as Konva.Group)
                }}
            >
            <Image  alt='player' image={image}/>
            <EditableText x={40} y={110} text={text} onChange={(value) => {setText(value); StartLabels.set(id, value)}} disabled={disabled}/>
            
        </Group>
    )
}