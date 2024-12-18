import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
// import { AsyncPipe } from '@angular/common';
import { GridCell } from './grid-cell';
import { Edges } from './edges';
// import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'app-grid-cell',
  templateUrl: 'grid-cell.component.html',
  styleUrls: ['./grid-cell.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    // AsyncPipe,
    // GridComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
  ],
})
export class GridCellComponent {
  @Input({ required: true }) gridCell: GridCell;
  @Input({}) col: number;
  @Input({}) row: number;
  @Input({}) grid: GridCell[][];
  @Input() currentColor: string;

  @Output() gridChange = new EventEmitter<{row: number, col: number, cell: GridCell}>();

  /**
   * Constructor for GridCellComponent.
   * Initializes a new GridCell if none is provided.
   */
  constructor() {
    if (!this.gridCell) {
      this.gridCell = new GridCell();
    }
  }

  /**
   * Handles input changes and updates the grid cell value if valid.
   * @param value - The input value to be set.
   */
  onInput(value: string) {
    if (this.validateInput(value)) {
      this.gridCell.value = value;
    } else {
      this.gridCell.value = '';
    }
    this.gridChange.emit({ row: this.row, col: this.col, cell: this.gridCell });
  }

  /**
   * Validates the input value.
   * @param value - The input value to be validated.
   * @returns True if the input is a single alphabetic character, false otherwise.
   */
  validateInput(value: string): boolean {
    const regex = /^[A-Za-z]$/;
    return regex.test(value);
  }

  /**
   * Sets the edges of the grid cell.
   * @param edges - The edges to be set.
   */
  setEdges(edges: Edges) {
    this.gridCell.edges = edges;
  }

  /**
   * sets the color of the cell
   * @param color - the color that the cell-background
   */
  setColor(color: string) {
    this.gridCell.color = color;
    this.gridChange.emit({ row: this.row, col: this.col, cell: this.gridCell });
  }

  /**
   * Sets the editable state of the grid cell.
   * @param state - The editable state to be set.
   */
  setEditable(state: boolean) {
    this.gridCell.editable = state;
  }

  /**
   * checks all edges to see if there all the same
   * @param rowOffset number to check adj row
   * @param colOffset number to check adj col
   * @returns returns the boolean true or false
   */
  allEdgeCheck(rowOffset: number, colOffset: number) {
    return (
      this.grid[this.row + rowOffset][this.col + colOffset].edges.top &&
      this.grid[this.row + rowOffset][this.col + colOffset].edges.right &&
      this.grid[this.row + rowOffset][this.col + colOffset].edges.bottom &&
      this.grid[this.row + rowOffset][this.col + colOffset].edges.left
    )
  }

  /**
   * checks this & an adjacent cell to see if it should be blacked-out or not
   * the else statement un-blacks out a cell if all edges are not bolded
   * @param rowOffset number to check adj row
   * @param colOffset number to check adj col
   */
  adjacentCellCheck(rowOffset: number, colOffset: number) {
    if (this.allEdgeCheck(rowOffset, colOffset)) {
      this.grid[this.row + rowOffset][this.col + colOffset].color = 'black';
    } else {
      if (
        this.grid[this.row + rowOffset][this.col + colOffset].color === 'black'
      ) {
        this.grid[this.row + rowOffset][this.col + colOffset].color = '';
      }
    }
  }

  /**
   * decides what adjacent cell to check
   * @param edge the edge to check
   */
  cellCheck(edge: string) {
    switch (edge) {
      case 'top':
        this.adjacentCellCheck(-1, 0);
        break;
      case 'right':
        this.adjacentCellCheck(0, 1);
        break;
      case 'bottom':
        this.adjacentCellCheck(1, 0);
        break;
      case 'left':
        this.adjacentCellCheck(0, -1);
        break;
      default:
        this.adjacentCellCheck(0, 0);
        break;
    }
  }

  /**
   * toggles the both this cells edge and adjacent cells edge
   * @param edge
   */
  toggleEdge(edge: string, emitChange: boolean) {
    switch (edge) {
      case 'top':
        this.gridCell.edges.top = !this.gridCell.edges.top;
        if (this.grid && this.grid[this.row - 1]) {
          this.grid[this.row - 1][this.col].edges.bottom =
            this.gridCell.edges.top;
          this.cellCheck('top');
        }
        break;
      case 'right':
        this.gridCell.edges.right = !this.gridCell.edges.right;
        if (this.grid && this.grid[this.row][this.col + 1]) {
          this.grid[this.row][this.col + 1].edges.left =
            this.gridCell.edges.right;
          this.cellCheck('right');
        }
        break;
      case 'bottom':
        this.gridCell.edges.bottom = !this.gridCell.edges.bottom;
        if (this.grid && this.grid[this.row + 1]) {
          this.grid[this.row + 1][this.col].edges.top =
            this.gridCell.edges.bottom;
          this.cellCheck('bottom');
        }
        break;
      case 'left':
        this.gridCell.edges.left = !this.gridCell.edges.left;
        if (this.grid && this.grid[this.row][this.col - 1]) {
          this.grid[this.row][this.col - 1].edges.right =
            this.gridCell.edges.left;
          this.cellCheck('left');
        }
        break;
      default:
        break;
    }
    this.cellCheck('');
    if (emitChange) {
      this.gridChange.emit({ row: this.row, col: this.col, cell: this.gridCell });
    }
  }

  /**
   * Blacks out a cell and its edges with ctrl
   *
   * Keeps all edges bolded, but makes the background white with alt
   * @param event - checks the key clicked
   */
  onClick(event: MouseEvent) {
    if (event.ctrlKey) {
      if (this.allEdgeCheck(0, 0)) {
        for (const edge in this.gridCell.edges) {
          this.toggleEdge(edge, false);
        }
      } else {
        for (const edge in this.gridCell.edges) {
          if (this.gridCell.edges[edge] === false) {
            this.toggleEdge(edge, false);
          }
        }
      }
      this.gridChange.emit({ row: this.row, col: this.col, cell: this.gridCell });
    } else if (event.altKey) {
      if (this.allEdgeCheck(0, 0)) {
        this.setColor('white');
      }
    }
  }

  /**
   * this will highlight a cell upon pressing the right click
   *
   * it will un-highlight if the cell you press on has the same color as the color
   * you have selected (the selected color is from the parent)
   * @param event - rightclick
   */
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.gridCell.color !== 'black') {
      if (event.button == 2) {
        if (this.gridCell.color !== this.currentColor) {
          this.setColor(this.currentColor);
        } else {
          this.setColor('');
        }
      }
    }
  }

  /**
   * when you hold shift with a color selected, a cell will be highlighted when your mouse leaves the cell
   * @param event - checks that shift key is held
   */
  onDrag(event: MouseEvent) {
    if (this.gridCell.color !== 'black') {
      if (event.shiftKey) {
        if (this.gridCell.color !== this.currentColor) {
          this.setColor(this.currentColor);
        } else {
          this.setColor('');
        }
      }
    }
  }

  /**
   * Handles keydown gridCell.edges.top ANDvents to toggle the bold state of the grid cell edges.
   * @param event - The keyboard event.
   */
  onKeyDown(event: KeyboardEvent) {
    if (this.gridCell.editable && event.ctrlKey) {
      event.preventDefault();
      switch (event.key) {
        case 'ArrowUp':
          this.toggleEdge('top', true);
          break;
        case 'ArrowRight':
          this.toggleEdge('right', true);
          break;
        case 'ArrowDown':
          this.toggleEdge('bottom', true);
          break;
        case 'ArrowLeft':
          this.toggleEdge('left', true);
          break;
        default:
          break;
      }
    }
  }
}
