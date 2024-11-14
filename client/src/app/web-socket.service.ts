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
    To run locally use:
      this.socket$ = new WebSocketSubject('ws://localhost:4567/api/websocket');
    To use with El's droplet for it-3 use:
      this.socket$ = new WebSocketSubject('wss://138.197.75.137.nip.io/api/websocket');
      also reach out ot El to have him change the branch the droplet is running on
    To use with different droplet account change id #.
    */
    // let wsURl = ${environment.wsURl};
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
