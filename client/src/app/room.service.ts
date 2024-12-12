import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GridPackage } from './grid/gridPackage';
import { Room } from './room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = '/api/rooms';

  constructor(private http: HttpClient) { }

  // this is not a valid route server side
  getRooms(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  addRoom(room: string): Observable<string> {
    return this.http.post<string>(this.apiUrl, { name: room });
  }

  /**
   * Get information of a room, buu room id
   * @param roomId
   * @returns the room (composed of the room name and ID)
   */
  getRoomById(roomId: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${roomId}`);
  }

  /**
   * Return grids belonging to a specific room
   * @param roomId room the user is in
   * @returns all grids that belong to the room
   */
  getGridsByRoomId(roomId: string): Observable<GridPackage[]> {
    return this.http.get<GridPackage[]>(`/api/${roomId}/grids`);
  }

  // gets all unique word groups from words in server
  getWordGroups(): Observable<string[]> {
    return this.http.get<string[]>(`/api/anagram/wordGroups`);
  }
}
