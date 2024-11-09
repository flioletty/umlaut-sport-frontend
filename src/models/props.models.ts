import React from "react";
import { Step } from "./moving.dto";
import Konva from "konva";

export interface DraggableThingProps extends DraggableBallProps {
    src: string;
    draggable?: boolean;
}

export interface DraggableBallProps {
    drawings: Step[];
    setDrawings: (React.Dispatch<React.SetStateAction<Step[]>>);
    x: number;
    y: number;
    id: string;
    innerRef:  React.RefObject<Konva.Group> | null;
    additionFunc?: ()=>void;
    disabled: boolean;
    name?: string;
    ballRef: React.RefObject<Konva.Node> | null;
    block?: boolean;
}

export interface ButtonProps {
    clickHandler: () => void;
    label: string;
    color?: ButtonColor;
    disabled?: boolean;
}

export type ButtonColor = 'white' | 'orange' | 'grey';

export interface ButtonWithIconProps {
    handleClick: () => void;
    iconSrc: string;
    width: number;
    height: number;
    className?: string;
    alt: string;
    color?: ButtonColor;
    disabled?: boolean; 
    label?: string;
}

export interface StrategyProps {
    name: string;
    id: number;
}

export interface LineProps {
    color?: ButtonColor;
    block?: boolean;
}

export interface LineInputProps {
    color?: ButtonColor;
    label: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
    value: string;
}

export interface EditableTextProps {
    x : number;
    y : number;
    onChange : (value: string) => void;
    text : string;
    disabled : boolean;
}

export interface OptionModel {
    name: string;
    id: number | string;
}
export interface LineSelectProps {
    color?: ButtonColor;
    label: string;
    options: OptionModel[];
    onChange: (React.Dispatch<React.SetStateAction<string | number>>);
    value: number | string;
}

export interface BallProps extends DraggableBallProps {
    src: string;
}

export interface SlideLineProps {
    onPlus: ()=>void;
    onMinus: ()=>void;
    onChangeCur: (num: number)=>void;
    slidesMax: number;
}
