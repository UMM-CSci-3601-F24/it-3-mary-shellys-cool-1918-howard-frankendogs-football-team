import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, CommonModule } from '@angular/common';
import { GridCell } from './grid-cell';
import { Edges } from './edges';
import { Colors } from './colors';

@Component({
  selector: 'app-grid-cell',
  templateUrl: 'grid-cell.component.html',
  styleUrls: ['./grid-cell.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
  ],
})
export class GridCellComponent {
  @Input({ required: true }) gridCell: GridCell;

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

  setColors(colors: Colors) {
    this.gridCell.color = colors;
  }
  /**
   * Sets the editable state of the grid cell.
   * @param state - The editable state to be set.
   */
  setEditable(state: boolean) {
    this.gridCell.editable = state;
  }

  /**
   * Handles keydown events to toggle the bold state of the grid cell edges.
   * @param event - The keyboard event.
   */
  onKeyDown(event: KeyboardEvent) {
    if (this.gridCell.editable && event.ctrlKey) {
      event.preventDefault();
      switch (event.key) {
        case 'ArrowUp':
          this.gridCell.toggleTopEdge();
          break;
        case 'ArrowRight':
          this.gridCell.toggleRightEdge();
          break;
        case 'ArrowDown':
          this.gridCell.toggleBottomEdge();
          break;
        case 'ArrowLeft':
          this.gridCell.toggleLeftEdge();
          break;
        default:
      }
    }
  }
}
