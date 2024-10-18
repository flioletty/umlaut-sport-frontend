import React from "react";
import { Moving } from "./moving.dto";

export interface DraggableThingProps extends DraggableBallProps {
    radius: number;
    color: string;
}

export interface DraggableBallProps {
    drawings: Moving[];
    setDrawings: React.Dispatch<React.SetStateAction<Moving[]>>;
    x: number;
    y: number;
    id: string;
    innerRef:  React.MutableRefObject<null>;
}