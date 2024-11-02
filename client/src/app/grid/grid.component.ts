import { Component, ElementRef, inject, Renderer2, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { GridCell } from '../grid-cell/grid-cell';
import { GridCellComponent } from '../grid-cell/grid-cell.component';
import { GridService } from './grid.service';
import { Grid } from './grid';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
// import { Grid } from './grid';

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
    RouterLink,
    MatButtonModule,
  ],
})
export class GridComponent {
  
  rowHight: number = 10;
  colWidth: number = 10;
  s: number = 40; //pixel size of gridCell?
  grid: GridCell[][] = [];
  savedGrids: Grid[];

  currentRow: number = 0;
  currentCol: number = 0;
  typeDirection: string = "right"; // Current direction
  typingDirections: string[] = ["right", "left", "up", "down"]; // Possible Directions
  currentDirectionIndex: number = 0;
  private focusTimeout: ReturnType<typeof setTimeout>;
  private route = inject(ActivatedRoute);

  constructor(private renderer: Renderer2, public elRef: ElementRef, private gridService: GridService) {
    this.initializeGrid();
    this.loadSavedGrids();
  }

  /**
   * Handles the input size change event.
   * Reinitializes the grid based on the new size.
   */
  onSizeInput() {
    console.log(this.colWidth);
    console.log(this.rowHight);
    this.initializeGrid();
  }

  /**
   * Handles the input size change event.
   * Reinitializes the grid based on the new size.
   */
  initializeGrid() {
    this.grid=[];
      for(let row=0; row<this.rowHight; ++row) {
        this.grid.push([]);
        for(let col=0; col<this.colWidth; ++col) {
          this.grid[row].push(new GridCell());
    }
   }
  }

  saveGrid() {
    const gridData: Partial<Grid> = {
      owner: 'currentUser', // Again a placeholder
      grid: this.grid
    };
    this.gridService.saveGrid(gridData).subscribe(() => {
      this.loadSavedGrids();
    });
  }

  loadSavedGrids() {
    this.gridService.getGrids().subscribe(grids => {
      this.savedGrids = grids;
    });
  }

  loadGrid(grid: Grid) {
    this.grid = grid.grid;
  }


  activeGrid = toSignal(
    this.route.paramMap.pipe(
      // Map the paramMap into the id
      map((paramMap: ParamMap) => paramMap.get('id')),
      // Maps the `id` string into the Observable<User>,
      // which will emit zero or one values depending on whether there is a
      // `User` with that ID.
      switchMap((id: string) => this.gridService.getGridById(id)),
      catchError((_err) => {
        this.error.set({
          help: 'There was a problem loading the user – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        });
        return of();
      })
      /*
       * You can uncomment the line that starts with `finalize` below to use that console message
       * as a way of verifying that this subscription is completing.
       * We removed it since we were not doing anything interesting on completion
       * and didn't want to clutter the console log
       */
      // finalize(() => console.log('We got a new user, and we are done!'))
    )
  );
  error = signal({ help: '', httpResponse: '', message: '' });

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
    const cell = this.grid[row][col];
    const inputElement = this.elRef.nativeElement.querySelector(`app-grid-cell[col="${col}"][row="${row}"] input`);

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
              if (cell.edges.left === false) {
                this.moveFocus(col - 1, row)
              }
            }
            if (this.typeDirection === "left") {
              if (cell.edges.right === false) {
                this.moveFocus(col + 1, row)
              }
            }
            if (this.typeDirection === "up") {
              if (cell.edges.bottom === false) {
                this.moveFocus(col, row + 1)
              }
            }
            if (this.typeDirection === "down") {
              if (cell.edges.top === false) {
                this.moveFocus(col, row - 1)
               }
            }
            break;
          default:
            if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {

              cell.value = event.key;

              if (this.typeDirection === "right") {
                if (cell.edges.right === false) {
                  this.moveFocus(col + 1, row)
                }
              }
              if (this.typeDirection === "left") {
                if (cell.edges.left === false) {
                  this.moveFocus(col - 1, row)
                }
              }
              if (this.typeDirection === "up") {
                if (cell.edges.top === false) {
                 this.moveFocus(col, row - 1)
                }
              }
              if (this.typeDirection === "down") {
                if (cell.edges.bottom === false) {
                  this.moveFocus(col, row + 1)
                }
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
    if (this.grid[row] != undefined && col >= 0 && col < this.grid[row].length && row >= 0 && row < this.grid.length) {
      this.currentCol = col;
      this.currentRow = row;

      console.log(col, row);

      const cellInput = document.querySelector(`app-grid-cell[col="${col}"][row="${row}"] input`);
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

  // saveGrid() {
  //   this.gridService.saveGrid(this.grid);
  // }
}
