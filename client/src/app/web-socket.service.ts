import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<unknown>;

  constructor() {
    this.socket$ = new WebSocketSubject('ws://localhost:8080');
  }

  sendMessage(message: unknown) {
    this.socket$.next(message);
  }

  getMessages() {
    return this.socket$.asObservable();
  }
}
