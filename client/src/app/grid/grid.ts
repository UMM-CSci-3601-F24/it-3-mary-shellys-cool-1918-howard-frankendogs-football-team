import { GridCell } from "../grid-cell/grid-cell";

export interface Grid {
    _id: string,
    owner: string,
    grid: GridCell[][]
}
