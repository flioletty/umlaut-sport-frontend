export interface Moving {
    objectName: string;
    x: number;
    y: number;
}

export interface Step {
    steps: Moving[];
}