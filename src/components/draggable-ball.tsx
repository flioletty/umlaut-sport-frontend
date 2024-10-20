/* eslint-disable @typescript-eslint/no-explicit-any */
import { Circle } from "react-konva"
import { DraggableThingProps } from "../models/props.models"
import React, { useCallback } from "react";
import { Step, Moving } from "../models/moving.dto";
import throttle from "lodash/throttle";

export function DraggableBall({drawings, setDrawings, x, y, radius, color, id, innerRef, additionFunc = () => {}} : DraggableThingProps) {
    
    const [steps, setSteps] = React.useState<Moving[]>([]);

    function findFigureById(figures: any) {
        for(const figure of figures) {
            if(figure.attrs.id === id) {
                return {
                        objectName: id,
                        steps : [{
                            x: figure.attrs.x,
                            y: figure.attrs.y
                        }]
                    } as Step;
            }
        }
    }

    function getPositionFromStage(stage: any) {
        const circle = stage.getLayers()[0].findOne(`#${id}`)
        return {x: circle.attrs.x, y: circle.attrs.y} as Moving

    }

    return(
        <Circle x={x} y={y} radius={radius} fill={color} id={id} 
            ref={innerRef}
            draggable
            onDragEnd={(e) => {
                const position = getPositionFromStage(e.target.getStage())
                setDrawings(drawings.concat({objectName: id, steps: steps.concat(position)} as Step))
                setSteps([])
                console.log("Drag end")
                additionFunc();
            }} 
            onDragMove={useCallback(
                throttle((e: any) => {
                        const position = getPositionFromStage(e.target.getStage())
                        setSteps(steps.concat(position))
                    }, 
                    100), 
                [])
            } 
            onDragStart={(e) => {
                const position = getPositionFromStage(e.target.getStage())
                setSteps(steps.concat(position))
            }}
        />
    )
}