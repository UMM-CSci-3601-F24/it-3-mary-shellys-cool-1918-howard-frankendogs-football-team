import { Component, inject } from '@angular/core';
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
  roomName: string;
  lastUpdated: Date;
  totalGrids: number;

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    private roomService: RoomService

  ) {

    route = inject(ActivatedRoute);

    this.route.paramMap.subscribe(params => {
      this.roomID = params.get('roomID');
      if (this.roomID) {
        this.roomService.getRoomById(this.roomID).subscribe(room => {
          this.roomName = room.name;
        });
        this.roomService.getGridsByRoomId(this.roomID).subscribe(grids => {
          this.totalGrids = grids.length;
        });
      }
    });
  }
}
