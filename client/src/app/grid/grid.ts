import { GridCell } from "../grid-cell/grid-cell";

export interface Grid {
    _id: String,
    owner: String,
    grid: GridCell[][]
}