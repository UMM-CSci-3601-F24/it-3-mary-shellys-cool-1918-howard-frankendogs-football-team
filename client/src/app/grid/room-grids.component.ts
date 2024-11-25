import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { GridService } from './grid.service';
// import { GridPackage } from './gridPackage';
import { GridCardComponent } from './grid-card.component';
import { RoomService } from '../room.service';
import { GridListComponent } from "./grid-list.component";
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-room-grids',
  templateUrl: './room-grids.component.html',
  styleUrls: ['./room-grids.component.scss'],
  imports: [GridCardComponent, GridListComponent, RouterModule, HttpClientModule, RouterLink],
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
