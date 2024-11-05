import { Step } from "./moving.dto";

export interface Draw {
    id: number;
    start?: Step[];
    data?: Step[];
    name: string;
    folder_id: number;
    comment: string;
    area: string;
}