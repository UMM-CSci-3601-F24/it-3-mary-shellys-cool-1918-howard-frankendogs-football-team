import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}