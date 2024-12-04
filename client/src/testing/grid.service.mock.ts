import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GridPackage } from 'src/app/grid/gridPackage';
import { GridService } from 'src/app/grid/grid.service';
import { AppComponent } from 'src/app/app.component';

@Injectable({
  providedIn: AppComponent
})
export class MockGridService extends GridService {
  static testGrids: GridPackage[] = [
    {
      _id: 'testGridId',
      roomID: 'testOwner',
      name: 'testGrid',
      lastSaved: new Date(),
      grid: [
        [
          { editable: true, value: '1', edges: { top: false, right: false, bottom: false, left: false }, color: '' },
          { editable: true, value: '2', edges: { top: false, right: false, bottom: false, left: false }, color: '' }
        ],
        [
          { editable: true, value: '3', edges: { top: false, right: false, bottom: false, left: false }, color: '' },
          { editable: true, value: '4', edges: { top: false, right: false, bottom: false, left: false }, color: '' }
        ]
      ]
    }
  ];

  constructor() {
    super(null);
  }

  getGrids(): Observable<GridPackage[]> {
    return of(MockGridService.testGrids);
  }

  // saveGrid(gridData: Partial<GridPackage>): Observable<string> {
  //   return of('newGridId');
  // }

  saveGridWithRoomId(roomId: string, gridData: Partial<GridPackage>): Observable<string> {
    const newGridId = 'newGridId';
    const newGrid: GridPackage = {
      ...gridData,
      _id: newGridId,
      roomID: roomId,
      lastSaved: new Date()
    } as GridPackage;
    MockGridService.testGrids.push(newGrid);
    return of(newGridId);
  }

  getGridById(id: string): Observable<GridPackage> {
    return of(MockGridService.testGrids.find(grid => grid._id === id));
  }

  deleteGrid(id: string): Observable<{ deletedId: string }> {
    MockGridService.testGrids = MockGridService.testGrids.filter(grid => grid._id !== id);
    return of({ deletedId: id });
  }
}
