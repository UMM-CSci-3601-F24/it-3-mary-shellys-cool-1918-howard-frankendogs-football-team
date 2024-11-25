import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoomService]
    });
    service = TestBed.inject(RoomService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get rooms from the server', () => {
    const mockRooms = ['Room 1', 'Room 2'];

    service.getRooms().subscribe(rooms => {
      expect(rooms).toEqual(mockRooms);
    });

    const req = httpTestingController.expectOne('/api/rooms');
    expect(req.request.method).toEqual('GET');
    req.flush(mockRooms);
  });

  it('should add a room to the server', () => {
    const newRoom = 'Room 3';

    service.addRoom(newRoom).subscribe(response => {
      expect(response).toEqual(newRoom);
    });

    const req = httpTestingController.expectOne('/api/rooms');
    expect(req.request.method).toEqual('POST');
    req.flush(newRoom);
  });
});