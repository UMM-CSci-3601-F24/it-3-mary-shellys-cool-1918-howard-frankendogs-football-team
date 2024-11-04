import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<unknown>;

  constructor() {
    this.socket$ = new WebSocketSubject('ws://localhost:4567/websocket');
    this.socket$.subscribe(
      (message) => console.log('Received message from server:', message),
      (err) => console.error('WebSocket error:', err),
      () => console.log('WebSocket connection closed')
    );
  }

  sendMessage(message: unknown) {
    console.log('Sending message to server:', message);
    this.socket$.next(message);
  }

  getMessage() {
    console.log('Getting messages from server');
    return this.socket$.asObservable();
  }
}
