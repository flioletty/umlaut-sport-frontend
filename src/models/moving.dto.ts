export interface Moving {
    x: number;
    y: number;
}

export interface Step {
    objectName: string;
    steps: Moving[];
}