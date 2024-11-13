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
    console.log(`save grid called with url": ${environment.apiUrl + 'grids'}`);
    // console.log(`save grid was called with id: ${gridData._id}`);

    console.log(`save grid was called with grid{0,0} : ${gridData.grid[0][0].value}`);
    console.log(`save grid was called with owner: ${gridData.roomID}`);
    return this.httpClient.post<{id: string}>(environment.apiUrl + 'grids', gridData).pipe(map(response => response.id));
  }

  saveGridWithRoomId(roomId: string, gridData: Partial<GridPackage>): Observable<string> {
    return this.httpClient.post<{id: string}>(`${environment.apiUrl}/grids`, gridData).pipe(map(response => response.id));
  }

  getGrids() {
    return this.httpClient.get<GridPackage[]>(environment.apiUrl + 'grids');
  }

  getGridById(id: string) {
    return this.httpClient.get<GridPackage>(environment.apiUrl + `grids/${id}`);
  }
}
