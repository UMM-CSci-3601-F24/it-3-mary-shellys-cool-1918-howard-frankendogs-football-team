import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { WebSocketService } from './web-socket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let sendNextSpy: jasmine.Spy;
  let asObservableSpy: jasmine.Spy;
  let handleNextSpy: jasmine.Spy;
  let subscribeSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
    sendNextSpy = spyOn(service['socket$'], 'next');
    handleNextSpy = spyOn(service['messageSubject'], 'next');
    asObservableSpy = spyOn(service['messageSubject'], 'asObservable').and.returnValue(new Subject());
    subscribeSpy = spyOn(service['socket$'], 'subscribe').and.callThrough();
  });

  afterEach(() => {
    sendNextSpy.calls.reset();
    handleNextSpy.calls.reset();
    asObservableSpy.calls.reset();
    subscribeSpy.calls.reset();
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

  it('should return message observable', () => {
    const messageObservable = service.getMessage();
    expect(messageObservable).toEqual(service['messageSubject'].asObservable());
  });


  it('should handle WebSocket completion', () => {
    const completeSpy = spyOn(service['socket$'], 'complete').and.callThrough();
    service['socket$'].complete();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should handle WebSocket error', () => {
    const error = new Error('WebSocket error');
    const errorSpy = spyOn(service['socket$'], 'error').and.callThrough();
    service['socket$'].error(error);
    expect(errorSpy).toHaveBeenCalledWith(error);
  });
});