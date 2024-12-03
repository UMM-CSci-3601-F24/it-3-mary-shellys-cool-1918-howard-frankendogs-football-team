import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterLink, Router } from '@angular/router';
import { GridService } from './grid.service';
// import { GridPackage } from './gridPackage';
import { GridCardComponent } from './grid-card.component';
import { RoomService } from '../room.service';
import { GridListComponent } from "./grid-list.component";
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GridCell } from '../grid-cell/grid-cell';


@Component({
  selector: 'app-room-grids',
  templateUrl: './room-grids.component.html',
  styleUrls: ['./room-grids.component.scss'],
  imports: [GridCardComponent, GridListComponent, RouterModule, HttpClientModule, RouterLink, MatFormFieldModule, FormsModule, MatSnackBarModule],
  standalone: true
})
export class RoomGridsComponent {

  roomID: string;
  roomName: string;
  lastUpdated: Date;
  totalGrids: number;
  newGridName: string = '';
  newGridRows: number = 10;
  newGridCols: number = 10;
  showNameLength: boolean = false;

  @ViewChild(GridListComponent) gridListComponent: GridListComponent;

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    private roomService: RoomService,
    private router: Router,
    public snackBar: MatSnackBar
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

  copyRoomLink() {
    const roomLink = `${window.location.origin}/${this.roomID}/grids`;
    navigator.clipboard.writeText(roomLink).then(() => {
      this.snackBar.open('Grid link copied to clipboard!', 'Close', { duration: 3000 });
    });
  }

  exitRoom() {
    this.router.navigate(['/']);
  }

  saveNewGrid() {
    this.newGridName = this.newGridName.trim();

    if (this.newGridName.length > 30) {
      this.snackBar.open('Grid name must be 30 characters or less.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.roomService.getGridsByRoomId(this.roomID).subscribe(grids => {
      const gridNames = grids.map(grid => grid.name);
      if (gridNames.includes(this.newGridName)) {
        this.snackBar.open('A grid with this name already exists in the room.', 'Close', {
          duration: 3000,
        });
        return;
      }

      const newGrid = {
        roomID: this.roomID,
        grid: Array.from({ length: this.newGridRows }, () => Array(this.newGridCols).fill(new GridCell)),
        name: this.newGridName || `New Grid ${new Date().toISOString()}`,
        lastSaved: new Date()
      };
      this.gridService.saveGrid(newGrid).subscribe(savedGrid => {
        this.roomService.getGridsByRoomId(this.roomID).subscribe(grids => {
          this.totalGrids = grids.length;
          this.gridListComponent.loadGrids();
          if (confirm('Grid created successfully. Do you want to navigate to the new grid?')) {
            this.router.navigate([`/${this.roomID}/grid/${savedGrid._id}`]);
          }
        });
      });
    });
  }

}
