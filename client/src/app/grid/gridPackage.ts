import { GridCell } from "../grid-cell/grid-cell";

export interface GridPackage {
    _id: string,
    roomID: string,
    grid: GridCell[][]
    name: string;
    lastSaved: Date;
}
