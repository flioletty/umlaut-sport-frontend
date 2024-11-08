import { Snapshot } from "./moving.dto";

export interface Draw {
    id: number;
    data?: Snapshot[];
    name: string;
    folder_id: number;
    comment: string;
    area: string;
}