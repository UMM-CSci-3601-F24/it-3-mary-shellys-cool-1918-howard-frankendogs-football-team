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

  saveGrid(gridData: Partial<GridPackage>): Observable<GridPackage> {
    return this.httpClient.post<GridPackage>(`${environment.apiUrl}grids`, gridData);
  }

  saveGridWithRoomId(roomId: string, gridData: Partial<GridPackage>): Observable<string> {
    return this.httpClient.post<{id: string}>(`${environment.apiUrl}grids`, gridData).pipe(map(response => response.id));
  }

  getGrids() {
    return this.httpClient.get<GridPackage[]>(environment.apiUrl + 'grids');
  }

  getGridById(id: string) {
    return this.httpClient.get<GridPackage>(environment.apiUrl + `grids/${id}`);
  }

  deleteGrid(id: string): Observable<{ deletedId: string }> {
    return this.httpClient.delete<{ deletedId: string }>(`${environment.apiUrl}grids/${id}`);
  }
}
