import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<unknown>;
  private messageSubject = new Subject<unknown>();

  constructor() {
    /*
    `${environment.wsURl} ` check the environment to see what URL to build with
    if the project is not building successfully use the urls bellow:
    the local url is: `ws://localhost:4567/api/websocket`
    the production url is: `wss://138.197.75.137.nip.io/api/websocket`
    */
    this.socket$ = new WebSocketSubject(`${environment.wsURL}`);
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
