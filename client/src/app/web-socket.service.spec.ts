import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { WebSocketService } from './web-socket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let sendNextSpy: jasmine.Spy;
  let asObservableSpy: jasmine.Spy;
  let handleNextSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
    sendNextSpy = spyOn(service['socket$'], 'next');
    handleNextSpy = spyOn(service['messageSubject'], 'next');
    asObservableSpy = spyOn(service['socket$'], 'asObservable').and.returnValue(new Subject());
  });

  afterEach(() => {
    sendNextSpy.calls.reset();
    asObservableSpy.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send message', () => {
    const data = { test: 'test' };

    service.sendMessage(data);

    expect(sendNextSpy).toHaveBeenCalledWith(data);
  });

  it('should receive message', () => {
    const data = { test: 'test' };
    service.handleMessage(data);
    expect(handleNextSpy).toHaveBeenCalledWith(data);
  });
});