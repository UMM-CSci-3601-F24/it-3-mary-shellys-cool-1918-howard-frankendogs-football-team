import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Grid } from './grid';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GridService {
  // readonly gridUrl: string =`${environment.apiUrl}grid`;

  constructor(private httpClient: HttpClient) { }

  saveGrid(gridData: Partial<Grid>): Observable<string> {
    console.log(`save grid called with url": ${environment.apiUrl + 'grids'}`);
    // console.log(`save grid was called with id: ${gridData._id}`);

    console.log(`save grid was called with grid{0,0} : ${gridData.grid[0][0].value}`);
    console.log(`save grid was called with id: ${gridData.owner}`);
    return this.httpClient.post<{id: string}>(environment.apiUrl + 'grids', gridData).pipe(map(response => response.id));
  }

  getGrids() {
    return this.httpClient.get<Grid[]>(environment.apiUrl + 'grids');
  }

  getGridById(id: string) {
    return this.httpClient.get<Grid>(environment.apiUrl + `grids/${id}`);
  }
}
