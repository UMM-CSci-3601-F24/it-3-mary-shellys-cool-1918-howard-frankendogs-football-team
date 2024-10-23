import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Grid } from './grid';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(private httpClient: HttpClient) { }

  saveGrid(gridData: Grid) {
    return this.httpClient.post(environment.apiUrl + 'save-grid', gridData);
  }

  getGrids() {
    return this.httpClient.get<Grid[]>(environment.apiUrl + 'grids');
  }

  getGridById(id: string) {
    return this.httpClient.get<Grid>(environment.apiUrl + `grids/${id}`);
  }
}
