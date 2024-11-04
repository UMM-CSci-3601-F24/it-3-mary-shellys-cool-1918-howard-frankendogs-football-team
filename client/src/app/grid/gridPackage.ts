import { GridCell } from "../grid-cell/grid-cell";

export interface GridPackage {
    _id: string,
    owner: string,
    grid: GridCell[][]
}
