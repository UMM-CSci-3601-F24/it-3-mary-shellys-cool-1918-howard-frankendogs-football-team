import { Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { GridCell } from '../grid-cell/grid-cell';
import { GridCellComponent } from '../grid-cell/grid-cell.component';
import { GridService } from './grid.service';
import { GridPackage } from './gridPackage';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { WebSocketService } from '../web-socket.service';
import { RoomService } from '../room.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-grid-component',
  templateUrl: 'grid.component.html',
  styleUrls: ['./grid.component.scss'],
  standalone: true,
  providers: [],
  imports: [
    MatButtonToggleModule,
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
    MatExpansionPanelDescription,
    MatIcon,
  ],
})
export class GridComponent {
  currentColor: string = 'Pink';
  highlight: string[] = ['Pink', 'Yellow', 'Green'];

  deleteDirectionBool: boolean = false;

  gridHeight: number = 10;
  gridWidth: number = 10;
  cellSize: number = 40;

  gridPackage: GridPackage = {
    grid: [],
    _id: '',
    roomID: '',
    name: '',
    lastSaved: null
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
    private webSocketService: WebSocketService,
    private router: Router,
    private snackBar: MatSnackBar) {

    this.route.paramMap.subscribe(params => {
      this.gridPackage.roomID = params.get('roomID');
      this.gridPackage._id = params.get('id');
    });

    if (this.gridPackage._id !== null && this.gridPackage._id !== '') {
      this.loadGrid(this.gridPackage._id);
    } else {
      this.initializeGrid();
    }

    this.loadSavedGrids();

    this.webSocketService.getMessage().subscribe((message: unknown) => {
      const msg = message as {
        type?: string;
        gridID?: string;
        cell?: GridCell;
        row?: number;
        col?: number;
      }; // all of these are optional to allow heartbeat messages to pass through

      if (
        msg.type === 'GRID_CELL_UPDATE' &&
        this.gridPackage._id === msg.gridID
      ) {
        // this.gridPackage.grid[msg.row][msg.col] = msg.cell;

        this.gridPackage.grid[msg.row][msg.col].color = msg.cell.color;
        this.gridPackage.grid[msg.row][msg.col].edges = msg.cell.edges;
        this.gridPackage.grid[msg.row][msg.col].value = msg.cell.value;

        if (this.gridPackage.grid[msg.row + 1][msg.col]) {
          this.gridPackage.grid[msg.row + 1][msg.col].edges.top =
            msg.cell.edges.bottom;
          this.updateCellColor(msg.row + 1, msg.col);
        }
        if (this.gridPackage.grid[msg.row - 1][msg.col]) {
          this.gridPackage.grid[msg.row - 1][msg.col].edges.bottom =
            msg.cell.edges.top;
          this.updateCellColor(msg.row - 1, msg.col);
        }
        if (this.gridPackage.grid[msg.row][msg.col + 1]) {
          this.gridPackage.grid[msg.row][msg.col + 1].edges.left =
            msg.cell.edges.right;
          this.updateCellColor(msg.row, msg.col + 1);
        }
        if (this.gridPackage.grid[msg.row][msg.col - 1]) {
          this.gridPackage.grid[msg.row][msg.col - 1].edges.right =
            msg.cell.edges.left;
          this.updateCellColor(msg.row, msg.col - 1);
        }
      }
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
        MatInputModule, 
   */
  onSizeInput() {
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
    this.gridSideBolder();
  }

  saveGrid() {
    if (this.gridPackage._id !== null && this.gridPackage._id !== '') {
      const gridData: Partial<GridPackage> = {
        roomID: this.gridPackage.roomID,
        grid: this.gridPackage.grid,
        _id: this.gridPackage._id,
        name: this.gridPackage.name,
        lastSaved: new Date()
      };
      this.gridService
        .saveGridWithRoomId(this.gridPackage.roomID, gridData)
        .subscribe(() => {
          this.gridPackage.lastSaved = new Date();
          this.loadSavedGrids();
          this.snackBar.open('Grid saved successfully!', 'Close', { duration: 3000 });
      });
    }
  }

  loadSavedGrids() {
    this.roomService
      .getGridsByRoomId(this.gridPackage.roomID)
      .subscribe((grids) => {
        this.savedGrids = grids;
      });
  }

  loadGrid(id: string) {
    this.gridService.getGridById(id).subscribe((activeGrid) => {
      console.log(activeGrid._id);
      this.gridPackage.name = activeGrid.name;
      this.gridPackage._id = activeGrid._id;
      this.gridPackage.roomID = activeGrid.roomID;
      this.gridPackage.lastSaved = activeGrid.lastSaved;
      this.applyGridUpdate(activeGrid.grid);
    });
  }

  onGridChange(event: { row: number; col: number; cell: GridCell }) {
    const message = {
      type: 'GRID_CELL_UPDATE',
      cell: event.cell,
      row: event.row,
      col: event.col,
      gridID: this.gridPackage._id,
    };

    this.webSocketService.sendMessage(message);
  }

  /**
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
   * bolds the outside boarder of the whole grid,
   * for loop goes from left to right of the grid, when row = 0 and then row = gridHight
   * for loop goes from top to bottom of the grid, when col = 0 and then col = gridWidth
   */
  gridSideBolder() {
    let col = 0;
    let row = 0;
    for (col; col <= this.gridWidth - 1; col++) {
      this.gridPackage.grid[0][col].edges.top = true;
      this.gridPackage.grid[this.gridHeight - 1][col].edges.bottom = true;
    }
    for (row; row <= this.gridHeight - 1; row++) {
      this.gridPackage.grid[row][0].edges.left = true;
      this.gridPackage.grid[row][this.gridWidth - 1].edges.right = true;
    }
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
            if (this.deleteDirectionBool) {
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
            } else {
              if (cell.edges.left === false) {
                this.moveFocus(col - 1, row);
              }
            }
            break;
          default:
            if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
              this.renderer.setProperty(inputElement, 'value', event.key);
              inputElement.dispatchEvent(new Event('input'));
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
              this.renderer.setProperty(inputElement, 'value', '');
              inputElement.dispatchEvent(new Event('input'));
              cell.value = '';

              this.moveFocus(col, row);
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

      const cellInput = document.querySelector(
        `app-grid-cell[col="${col}"][row="${row}"] input`
      );

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
  }

  /**
   * flips the bool deleteDirectionBool
   */
  deleteDirectionToggle() {
    this.deleteDirectionBool = !this.deleteDirectionBool;
  }

  updateCellColor(row: number, col: number) {
    const cell = this.gridPackage.grid[row][col];
    if (
      cell.edges.top &&
      cell.edges.right &&
      cell.edges.bottom &&
      cell.edges.left
    ) {
      cell.color = 'black';
    }
  }

  copyGridLink() {
    const gridLink = `${window.location.origin}/${this.gridPackage.roomID}/grid/${this.gridPackage._id}`;
    navigator.clipboard.writeText(gridLink).then(() => {
      this.snackBar.open('Grid link copied to clipboard!', 'Close', { duration: 3000 });
    });
  }

  leaveGrid() {
    this.router.navigate([`/${this.gridPackage.roomID}/grids`]);
  }
}
