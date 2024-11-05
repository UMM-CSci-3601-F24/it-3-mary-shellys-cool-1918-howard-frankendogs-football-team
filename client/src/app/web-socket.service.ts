import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<unknown>;
  private messageSubject = new Subject<unknown>();

  constructor() {
    this.socket$ = new WebSocketSubject('ws://localhost:4567/api/websocket');
    this.socket$.subscribe(
      (message) => this.handleMessage(message),
      (err) => console.error('WebSocket error:', err),
      () => console.log('WebSocket connection closed')
    );
  }

  sendMessage(message: unknown) {
    console.log('Sending message to server:', message);
    this.socket$.next(message);
  }

  getMessage() {
    return this.messageSubject.asObservable();
  }

  handleMessage(message: unknown) {
    console.log('Received message from server:', message);
    this.messageSubject.next(message);
  }
}
