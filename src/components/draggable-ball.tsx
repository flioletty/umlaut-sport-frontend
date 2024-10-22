/* eslint-disable @typescript-eslint/no-explicit-any */
import { Circle } from "react-konva"
import { DraggableThingProps } from "../models/props.models"
import React from "react";
import { Step, Moving } from "../models/moving.dto";

export function DraggableBall({drawings, setDrawings, x, y, radius, color, id, innerRef, additionFunc = () => {}} : DraggableThingProps) {
    
    const [steps, setSteps] = React.useState<Moving[]>([]);

    function getPositionFromStage(stage: any) {
        const circle = stage.getLayers()[0].findOne(`#${id}`)
        return {x: circle.attrs.x, y: circle.attrs.y} as Moving

    }

    return(
        <Circle x={x} y={y} radius={radius} fill={color} id={id} 
            ref={innerRef}
            draggable
            onDragEnd={() => {
                const step = {objectName: id, steps: [...steps].filter((el, ind)=>ind%8===0)} as Step
                setDrawings(drawings.concat(step))
                console.log("Drag end", drawings)
                additionFunc();
            }} 
            onDragMove={ (e) => {
                        const position = getPositionFromStage(e.target.getStage())
                        setSteps(steps.concat(position))
                        console.log(position, steps)
                }
            } 
            onDragStart={(e) => {
                steps.length = 0
                setSteps(steps)
                const position = getPositionFromStage(e.target.getStage())
                setSteps(steps.concat(position))
            }}
        />
    )
}