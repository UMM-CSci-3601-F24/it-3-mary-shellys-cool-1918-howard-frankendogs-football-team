import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Grid } from 'src/app/grid/grid';
import { GridService } from 'src/app/grid/grid.service';
import { AppComponent } from 'src/app/app.component';

@Injectable({
  providedIn: AppComponent
})
export class MockGridService extends GridService {
  static testGrids: Grid[] = [
    {
      _id: 'testGridId',
      owner: 'testOwner',
      grid: [
        [
          { editable: true, value: '1', edges: { top: false, right: false, bottom: false, left: false } },
          { editable: true, value: '2', edges: { top: false, right: false, bottom: false, left: false } }
        ],
        [
          { editable: true, value: '3', edges: { top: false, right: false, bottom: false, left: false } },
          { editable: true, value: '4', edges: { top: false, right: false, bottom: false, left: false } }
        ]
      ]
    }
  ];

  constructor() {
    super(null);
  }

  getGrids(): Observable<Grid[]> {
    return of(MockGridService.testGrids);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveGrid(gridData: Partial<Grid>): Observable<string> {
    return of('newGridId');
  }

}
