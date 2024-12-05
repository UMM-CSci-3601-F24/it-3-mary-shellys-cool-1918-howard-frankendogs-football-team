import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoomService } from './room.service';
import { HttpClient } from '@angular/common/http';
import { Room } from './room';
import { of } from 'rxjs';

describe('RoomService', () => {
  let service: RoomService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoomService]
    });
    httpClient = TestBed.inject(HttpClient);
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

  it('should get room by id', () => {
    const testRoom: Room = {
      _id: "targetId",
      name: "My Room Name"
    }
      const mockedMethod = spyOn(httpClient, "get").and.returnValue(of(testRoom));
      service.getRoomById(testRoom._id).subscribe(() => {
        expect(mockedMethod).withContext("one call").toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext("talks to correct endpoint")
          .toHaveBeenCalledWith(`/api/rooms/`+testRoom._id);
      })
  });

  it('should get all word groups', () => {
    // this will eventually be:
    //  "should get all word groups from room: id#"
    const targetWordGroups =  ["Foods" , "members"];
    service.getWordGroups().subscribe(wordGroups => [
      expect(wordGroups).toEqual(targetWordGroups)
    ]);

    const req = httpTestingController.expectOne('/api/anagram/wordGroups');
    expect(req.request.method).toEqual('GET');
    req.flush(targetWordGroups);
  })
});
