import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
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
      name: 'teastGrid',
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

  // getGrids(): Observable<GridPackage[]> {
  //   return of(MockGridService.testGrids);
  // }

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // saveGrid(gridData: Partial<GridPackage>): Observable<string> {
  //   return of('newGridId');
  // }

}
