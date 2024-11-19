import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GridPackage } from './grid/gridPackage';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = '/api/rooms';

  constructor(private http: HttpClient) { }

  getRooms(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  addRoom(room: string): Observable<string> {
    return this.http.post<string>(this.apiUrl, { name: room });
  }

  getGridsByRoomId(roomId: string): Observable<GridPackage[]> {
    return this.http.get<GridPackage[]>(`/api/${roomId}/grids`);
  }

  getWordGroups(): Observable<string[]> {
    console.log("entered getWordGroups() in room service");
    return this.http.get<string[]>(`/api/anagram/wordGroups`);
  }
}
