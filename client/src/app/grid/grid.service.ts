import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(private httpClient: HttpClient) { }

  

  saveGrid() {
    throw new Error('Method not implemented.');
    // return this.httpClient.post<{}>(this.gridUrl)
  }

}
