import { Moving } from "./moving.dto";

export interface Draw {
    id: number;
    start?: Moving[];
    data?: Moving[];
    name: string;
}