import { Component, Input } from '@angular/core';
import { GridPackage } from './gridPackage';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

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
  @Input({ required: true }) grid: GridPackage;
}
