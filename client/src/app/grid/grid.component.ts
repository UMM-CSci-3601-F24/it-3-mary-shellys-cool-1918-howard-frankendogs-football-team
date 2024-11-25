import { Component, ElementRef, inject, Renderer2 } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { GridCell } from '../grid-cell/grid-cell';
import { GridCellComponent } from '../grid-cell/grid-cell.component';
import { GridService } from './grid.service';
import { GridPackage } from './gridPackage';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { WebSocketService } from '../web-socket.service';
import { RoomService } from '../room.service';
import {MatRadioModule} from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-grid-component',
  templateUrl: 'grid.component.html',
  styleUrls: ['./grid.component.scss'],
  standalone: true,
  providers: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    CommonModule,
    GridCellComponent,
    MatGridListModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatIcon
  ],
})
export class GridComponent {
  currentColor: string;
  highlight: string[] = ['pink', 'yellow', 'green'];


  gridHeight: number = 10;
  gridWidth: number = 10;
  cellSize: number = 40;

  gridPackage: GridPackage = {
    grid: [],
    _id: '',
    roomID: ''
  }

  savedGrids: GridPackage[];

  currentRow: number = 0;
  currentCol: number = 0;
  typeDirection: string = 'right'; // Current direction
  typingDirections: string[] = ['right', 'left', 'up', 'down']; // Possible Directions
  currentDirectionIndex: number = 0;

  private focusTimeout: ReturnType<typeof setTimeout>;
  private route = inject(ActivatedRoute);

  constructor(
    private renderer: Renderer2,
    public elRef: ElementRef,
    private gridService: GridService,
    private roomService: RoomService,
    private webSocketService: WebSocketService) {
    this.route.paramMap.subscribe(params => {
      this.gridPackage.roomID = params.get('roomID');
      console.log(params.get('roomID'));
    });
    this.initializeGrid();
    this.loadSavedGrids();

    this.webSocketService.getMessage().subscribe((message: unknown) => {
      const msg = message as { type?: string; grid?: GridCell[][]; id?: string };
      // all of these are optional to allow heartbeat messages to pass through
      if (
        // checks that message was a grid update
        msg.type === 'GRID_UPDATE' &&
        // checks that grid you have open is the same as the one that was updated
        this.gridPackage._id == (message as { id: string }).id
      ) { this.applyGridUpdate(msg.grid); }
    });
  }

  applyGridUpdate(grid: GridCell[][]) {
    this.gridPackage.grid = grid;
    this.gridHeight = grid.length;
    this.gridWidth = grid[0].length;
  }

  /**
   * Handles the input size change event.
   * Reinitializes the grid based on the new size.
   */
  onSizeInput() {
    console.log(this.gridWidth);
    console.log(this.gridHeight);
    this.initializeGrid();
  }

  /**
   * Handles the input size change event.
   * Reinitializes the grid based on the new size.
   */
  initializeGrid() {
    this.gridPackage.grid = [];
    for (let row = 0; row < this.gridHeight; ++row) {
      this.gridPackage.grid.push([]);
      for (let col = 0; col < this.gridWidth; ++col) {
        this.gridPackage.grid[row].push(new GridCell());
      }
    }
  }

  saveGrid() {
    if (this.gridPackage._id !== null && this.gridPackage._id !== '') {
      const gridData: Partial<GridPackage> = {
        roomID: this.gridPackage.roomID,
        grid: this.gridPackage.grid,
        _id: this.gridPackage._id,
      };
      this.gridService.saveGridWithRoomId(this.gridPackage.roomID, gridData).subscribe(() => {
        this.loadSavedGrids();
      });
    } else {
      const gridData:Partial<GridPackage> = {
        roomID: this.gridPackage.roomID,
        grid: this.gridPackage.grid
      };
      this.gridService.saveGridWithRoomId(this.gridPackage.roomID, gridData).subscribe(() => {
        this.loadSavedGrids();
      });
    }
  }

  loadSavedGrids() {
    this.roomService.getGridsByRoomId(this.gridPackage.roomID).subscribe(grids => {
      this.savedGrids = grids;
    });
  }

  loadGrid(id: string) {
    this.gridService.getGridById(id).subscribe((activeGrid) => {
      console.log(activeGrid._id);

        this.gridPackage._id = activeGrid._id;
        this.gridPackage.roomID = activeGrid.roomID;
        this.applyGridUpdate(activeGrid.grid);
      },
    );
  }

  onGridChange() {
    const message = {
      type: 'GRID_UPDATE',
      grid: this.gridPackage.grid,
      roomID: this.gridPackage.roomID,
      id: this.gridPackage._id
    };
    this.webSocketService.sendMessage(message);
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
    const cell = this.gridPackage.grid[row][col];
    const inputElement = this.elRef.nativeElement.querySelector(
      `app-grid-cell[col="${col}"][row="${row}"] input`
    );

    console.log('keydown', event.key, col, row);

    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
    }

    this.focusTimeout = setTimeout(() => {
      // Look into debounce, probably a better solution than timeout
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
            if (this.typeDirection === 'right') {
              if (cell.edges.left === false) {
                this.moveFocus(col - 1, row);
              }
            }
            if (this.typeDirection === 'left') {
              if (cell.edges.right === false) {
                this.moveFocus(col + 1, row);
              }
            }
            if (this.typeDirection === 'up') {
              if (cell.edges.bottom === false) {
                this.moveFocus(col, row + 1);
              }
            }
            if (this.typeDirection === 'down') {
              if (cell.edges.top === false) {
                this.moveFocus(col, row - 1);
              }
            }
            break;
          default:
            if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
              cell.value = event.key;

              if (this.typeDirection === 'right') {
                if (cell.edges.right === false) {
                  this.moveFocus(col + 1, row);
                }
              }
              if (this.typeDirection === 'left') {
                if (cell.edges.left === false) {
                  this.moveFocus(col - 1, row);
                }
              }
              if (this.typeDirection === 'up') {
                if (cell.edges.top === false) {
                  this.moveFocus(col, row - 1);
                }
              }
              if (this.typeDirection === 'down') {
                if (cell.edges.bottom === false) {
                  this.moveFocus(col, row + 1);
                }
              }
            }
            break;
        }
      } else {
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
    });
  }


  /**
   * Moves the focus to the specified cell.
   *
   * @param col - The column index of the target cell.
   * @param row - The row index of the target cell.
   */
  moveFocus(col: number, row: number) {
    if (
      this.gridPackage.grid[row] != undefined &&
      col >= 0 &&
      col < this.gridPackage.grid[row].length &&
      row >= 0 &&
      row < this.gridPackage.grid.length
    ) {
      this.currentCol = col;
      this.currentRow = row;

      console.log(col, row);

      const cellInput = document.querySelector(
        `app-grid-cell[col="${col}"][row="${row}"] input`
      );
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
    this.currentDirectionIndex =
      (this.currentDirectionIndex + 1) % this.typingDirections.length;
    this.typeDirection = this.typingDirections[this.currentDirectionIndex];
    console.log(`Typing direction changed to: ${this.typeDirection}`);
  }

}
