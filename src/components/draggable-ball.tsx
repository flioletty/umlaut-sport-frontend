/* eslint-disable @typescript-eslint/no-explicit-any */
import { Circle } from "react-konva"
import { DraggableThingProps } from "../models/props.models"
import React from "react";
import { Step } from "../models/moving.dto";

export function DraggableBall({drawings, setDrawings, x, y, radius, color, id, innerRef, additionFunc = () => {}} : DraggableThingProps) {
    
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

    return(
        <Circle x={x} y={y} radius={radius} fill={color} id={id} 
            ref={innerRef}
            draggable
            onDragEnd={(e) => {
                const str = e.target.getStage()?.toJSON();
                const figures = JSON.parse(str ?? '').children[0].children;
                const needFigure = findFigureById(figures);
                if(needFigure) {
                    setDrawings(drawings.concat(needFigure))
                    additionFunc();
                }
            }} 
            onDragMove={(e) => {
                const str = e.target.getStage()?.toJSON();
                console.log(str)
            }} 
        />
    )
}