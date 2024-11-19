import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { GridPackage } from './gridPackage';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GridService {
  constructor(private httpClient: HttpClient) { }

  saveGrid(gridData: Partial<GridPackage>): Observable<string> {

    console.log(`save grid was called with name: ${gridData.name}`);
    return this.httpClient.post<{id: string}>(environment.apiUrl + 'grids', gridData).pipe(map(response => response.id));
  }

  saveGridWithRoomId(roomId: string, gridData: Partial<GridPackage>): Observable<string> {
    console.log(`save grid was called with owner: ${gridData.name}`);
    return this.httpClient.post<{id: string}>(`${environment.apiUrl}grids`, gridData).pipe(map(response => response.id));
  }

  getGrids() {
    return this.httpClient.get<GridPackage[]>(environment.apiUrl + 'grids');
  }

  getGridById(id: string) {
    return this.httpClient.get<GridPackage>(environment.apiUrl + `grids/${id}`);
  }
}
