import { Component, Input } from '@angular/core';
import { GridPackage } from './gridPackage';

@Component({
  selector: 'app-grid-card',
  standalone: true,
  imports: [],
  templateUrl: './grid-card.component.html',
  styleUrls: ['./grid-card.component.scss'],
})
export class GridCardComponent {
  @Input() grid: GridPackage;
}
