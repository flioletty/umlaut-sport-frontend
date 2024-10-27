import React from "react";
import { Step } from "./moving.dto";

export interface DraggableThingProps extends DraggableBallProps {
    radius: number;
    color: string;
}

export interface DraggableBallProps {
    drawings: Step[];
    setDrawings: (React.Dispatch<React.SetStateAction<Step[]>>);
    x: number;
    y: number;
    id: string;
    innerRef:  React.MutableRefObject<null>;
    additionFunc?: ()=>void;
}

export interface ButtonProps {
    clickHandler: () => void;
    label: string;
    color?: ButtonColor;
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
}

export interface LineInputProps {
    color?: ButtonColor;
    label: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
    value: string;
}

export interface LineSelectProps {
    color?: ButtonColor;
    label: string;
    options: string[];
    onChange: React.Dispatch<React.SetStateAction<string>>;
    value: string;
}