import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridService } from './grid.service';
// import { GridPackage } from './gridPackage';
import { GridCardComponent } from './grid-card.component';
import { RoomService } from '../room.service';
import { GridListComponent } from "./grid-list.component";


@Component({
  selector: 'app-room-grids',
  templateUrl: './room-grids.component.html',
  styleUrls: ['./room-grids.component.scss'],
  imports: [GridCardComponent, GridListComponent],
  standalone: true
})
export class RoomGridsComponent {
  roomID: string;

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    private roomService: RoomService

  ) {}



}
