import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GridPackage } from './gridPackage';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GridService } from './grid.service';

@Component({
  selector: 'app-grid-card',
  standalone: true,
  imports: [
    MatCardModule,
    RouterLink,
    DatePipe
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './grid-card.component.html',
  styleUrls: ['./grid-card.component.scss'],
})
export class GridCardComponent {
  @Input({ required: true }) gridPackage: GridPackage;
  @Output() gridDeleted = new EventEmitter<string>();

  constructor(private gridService: GridService) {}

  deleteGrid(event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete the grid: ${this.gridPackage.name}?`)) {
      this.gridService.deleteGrid(this.gridPackage._id).subscribe(response => {
        this.gridDeleted.emit(response.deletedId);
      });
    }
  }
}