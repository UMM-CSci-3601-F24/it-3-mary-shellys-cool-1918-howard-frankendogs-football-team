import { Component, ElementRef, Renderer2 } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { GridCell } from '../grid-cell/grid-cell';
import { GridCellComponent } from '../grid-cell/grid-cell.component';

@Component({
  selector: 'app-grid-component',
  templateUrl: 'grid.component.html',
  styleUrls: ['./grid.component.scss'],
  standalone: true,
  providers: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    GridCellComponent,
    MatGridListModule,
  ],
})
export class GridComponent {

  n: number = 10;
  m: number = 40;

  grid: GridCell[][] = [];
  currentRow: number = 0;
  currentCol: number = 0;
  typeDirection: string = "right"; // Current direction
  typingDirections: string[] = ["right", "left", "up", "down"]; // Possible Directions
  currentDirectionIndex: number = 0;
  private focusTimeout: ReturnType<typeof setTimeout>;

  constructor(private renderer: Renderer2, public elRef: ElementRef) {
    this.initializeGrid();
  }


  /**
   * Handles the input size change event.
   * Reinitializes the grid based on the new size.
   */
  onSizeInput() {
    console.log(this.n);
    this.initializeGrid();
  }

  /**
   * Handles the input size change event.
   * Reinitializes the grid based on the new size.
   */
  initializeGrid() {
    this.grid=[];
      for(let row=0; row<this.n; ++row) {
        this.grid.push([]);
        for(let col=0; col<this.n; ++col) {
          this.grid[row].push(new GridCell());
    }
   }
  }

  /**
   * Handles the click event on a grid cell.
   * Moves the focus to the clicked cell.
   *
   * @param event - The mouse event.
   * @param col - The column index of the clicked cell.
   * @param row - The row index of the clicked cell.
   */

  onClick(event: MouseEvent, col: number, row: number) {
    this.moveFocus(col, row);
  }

  /**
   * Handles the keydown event on a grid cell.
   * Moves the focus or modifies the cell value based on the key pressed.
   *
   * @param event - The keyboard event.
   * @param col - The column index of the focused cell.
   * @param row - The row index of the focused cell.
   */
  onKeydown(event: KeyboardEvent, col: number, row: number) {
    const cell = this.grid[col][row];
    const inputElement = this.elRef.nativeElement.querySelector(`app-grid-cell[data-col="${col}"][data-row="${row}"] input`);

    console.log('keydown', event.key, col, row);

    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
    }

    this.focusTimeout = setTimeout(() => { // Look into debounce, probably a better solution than timeout
    if (!event.ctrlKey) {
      switch (event.key) {
          case 'ArrowUp':
            this.moveFocus(col, row - 1);
            break;
          case 'ArrowDown':
            this.moveFocus(col, row + 1);
            break;
          case 'ArrowLeft':
            this.moveFocus(col - 1, row);
            break;
          case 'ArrowRight':
            this.moveFocus(col + 1, row);
            break;
          case 'Backspace':
            if (inputElement) {
              cell.value = '';
            }
            if (this.typeDirection === "right") {
              this.moveFocus(col - 1, row)
            }
            if (this.typeDirection === "left") {
              this.moveFocus(col + 1, row)
            }
            if (this.typeDirection === "up") {
              this.moveFocus(col, row + 1)
            }
            if (this.typeDirection === "down") {
              this.moveFocus(col, row - 1)
            }
            break;
          default:
            if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
              console.log('old cell value = ', cell.value);
              cell.value = event.key;
              console.log('new cell value = ', cell.value);
              if (this.typeDirection === "right") {
                console.log('moving focus to ', col + 1, row);
                this.moveFocus(col + 1, row)
              }
              if (this.typeDirection === "left") {
                this.moveFocus(col - 1, row)
              }
              if (this.typeDirection === "up") {
                this.moveFocus(col, row - 1)
              }
              if (this.typeDirection === "down") {
                this.moveFocus(col, row + 1)
              }
            }
            break;
        }
      } else{
          switch (event.key) {
            case 'Backspace':
            if (inputElement) {
              console.log(inputElement.value);
              this.renderer.setProperty(inputElement, 'value', '');
              setTimeout(() => this.moveFocus(col, row), 0);
              console.log(inputElement.value);
            }
        }
      }
    }, );
  }

  /**
   * Moves the focus to the specified cell.
   *
   * @param col - The column index of the target cell.
   * @param row - The row index of the target cell.
   */
  moveFocus(col: number, row: number) {
    if (col >= 0 && col < this.grid.length && row >= 0 && row < this.grid[col].length) {
      this.currentCol = col;
      this.currentRow = row;

      console.log(col, row);

      const cellInput = document.querySelector(`app-grid-cell[data-col="${col}"][data-row="${row}"] input`);
      console.log(cellInput);

      if (cellInput) {
        setTimeout(() => (cellInput as HTMLElement).focus());
      }
    }
  }

  /**
   * Cycles through the typing directions.
   * Updates the current typing direction.
   */
  cycleTypingDirection() {
    this.currentDirectionIndex = (this.currentDirectionIndex + 1) % this.typingDirections.length;
    this.typeDirection = this.typingDirections[this.currentDirectionIndex];
    console.log(`Typing direction changed to: ${this.typeDirection}`);
  }
}
