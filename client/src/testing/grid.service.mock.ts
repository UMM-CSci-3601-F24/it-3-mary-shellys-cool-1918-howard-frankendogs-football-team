import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AppComponent } from "src/app/app.component";
import { Grid } from "src/app/grid/grid";
import { GridService } from "src/app/grid/grid.service";

@Injectable({
  providedIn: AppComponent
})
export class MockGridService extends GridService {


  static testGrids: Grid[] = [ //this is really just one grid I dont have time for that
    {
      _id: "peepee",
      owner: "poopoo",
      grid: [
        [
          {
            editable: true,
            value: "1",
            edges: {top: false, right: false, bottom: false, left: false}
          },
          {
            editable: true,
            value: "2",
            edges: {top: false, right: false, bottom: false, left: false}
          }
        ],
        [
          {
            editable: true,
            value: "3",
            edges: {top: false, right: false, bottom: false, left: false}
          },
          {
            editable: true,
            value: "4",
            edges: {top: false, right: false, bottom: false, left: false}
          }
        ],
      ]
    }
  ];

  constructor() {
    super(null);
  }

  getGrids(): Observable<Grid[]> {
      return of(MockGridService.testGrids);
  }

}
