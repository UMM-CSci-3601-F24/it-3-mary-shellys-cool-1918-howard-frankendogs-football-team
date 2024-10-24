import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Grid } from './grid';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GridService {
  readonly gridUrl: string =`${environment.apiUrl}grid`;

  constructor(private httpClient: HttpClient) { }

  saveGrid(gridData: Partial<Grid>): Observable<string> {
    console.log(`save grid called with url": ${this.gridUrl}`);
    console.log(`save grid was called with gridData: ${gridData}`);
    return this.httpClient.post<{id: string}>(this.gridUrl, gridData).pipe(map(response => response.id));
    // return this.httpClient.post(environment.apiUrl + 'save-grid', gridData);

  }

  getGrids() {
    return this.httpClient.get<Grid[]>(environment.apiUrl + 'grids');
  }

  getGridById(id: string) {
    return this.httpClient.get<Grid>(environment.apiUrl + `grids/${id}`);
  }
}
