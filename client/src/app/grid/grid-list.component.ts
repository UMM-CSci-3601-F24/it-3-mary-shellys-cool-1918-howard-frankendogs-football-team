import { Component, inject, Input, OnInit } from '@angular/core';
import { GridCardComponent } from "./grid-card.component";
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { GridPackage } from './gridPackage';
import { GridService } from './grid.service';
import { RoomService } from '../room.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-grid-list',
  standalone: true,
  imports: [GridCardComponent, RouterLink, RouterModule, HttpClientModule],
  templateUrl: './grid-list.component.html',
  styleUrl: './grid-list.component.scss'
})
export class GridListComponent implements OnInit{
  @Input() grids: GridPackage[];
  @Input() roomID: string;


  constructor (
    private route: ActivatedRoute,
    private gridService: GridService,
    private roomService: RoomService
  ) {
    route = inject(ActivatedRoute);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomID = params.get('roomID');
      this.loadGrids();
    });
  }

  loadGrids(): void {
    if (this.roomID) {
      console.log(this.roomID);
      this.roomService.getGridsByRoomId(this.roomID).subscribe(grids => {
        this.grids = grids;
      });
      console.log(this.grids);
    } else {
      console.error('roomID is null or undefined');
    }
  }

}
