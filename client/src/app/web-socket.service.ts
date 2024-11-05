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
    /*
    The web socket subject currently being used allows websocket to work on
      digital ocean on El's specific droplet for it-2
    To use with different droplet account change id #.
    To use locally use:
      this.socket$ = new WebSocketSubject('ws://localhost:4567/websocket');
    */
    this.socket$ = new WebSocketSubject('wss://138.197.75.137.nip.io/api/websocket');
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
