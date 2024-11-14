export interface Moving {
    x: number;
    y: number;
}

export interface Step {
    objectName: string;
    movings: Moving[];
    label: string;
    hasBall: boolean;
    hasBlock: boolean;
}

export interface Snapshot {
    snapnum: number;
    step: Step[];
}
