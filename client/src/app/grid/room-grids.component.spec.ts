import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RoomGridsComponent } from './room-grids.component';
import { GridService } from './grid.service';
import { RoomService } from '../room.service';
import { MockGridService } from 'src/testing/grid.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('RoomGridsComponent', () => {
  let component: RoomGridsComponent;
  let fixture: ComponentFixture<RoomGridsComponent>;
  let mockRoomService: jasmine.SpyObj<RoomService>;

  beforeEach(async () => {
    mockRoomService = jasmine.createSpyObj('RoomService', ['getGridsByRoomId', 'getRoomById']);
    await TestBed.configureTestingModule({
      imports: [RoomGridsComponent, RouterTestingModule, HttpClientTestingModule, MatSnackBarModule],
      providers: [
        { provide: GridService, useClass: MockGridService },
        { provide: RoomService, useValue: mockRoomService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomGridsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load grids based on roomID', fakeAsync(() => {
    const mockGrids = [
      { _id: '1', name: 'Grid 1', roomID: 'room1', grid: [], lastSaved: new Date() },
      { _id: '2', name: 'Grid 2', roomID: 'room2', grid: [], lastSaved: new Date() }
    ];
    mockRoomService.getGridsByRoomId.and.returnValue(of(mockGrids));
    component.gridListComponent.roomID = 'room1';
    component.gridListComponent.loadGrids();
    tick();
    expect(mockRoomService.getGridsByRoomId).toHaveBeenCalledWith('room1');
    expect(component.gridListComponent.grids.length).toBe(mockGrids.length);
  }));

  it('should copy room link to clipboard', () => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    component.roomID = 'room1';
    component.copyRoomLink();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/room1/grids`);
  });

  it('should navigate to home on exit', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.exitRoom();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should save new grid', fakeAsync(() => {
    const mockGrids = [
      { _id: '1', name: 'Grid 1', roomID: 'room1', grid: [], lastSaved: new Date() }
    ];

    mockRoomService.getGridsByRoomId.and.returnValue(of(mockGrids));

    const newGrid = { _id: '507f1f77bcf86cd799439011', name: 'New Grid', roomID: 'room1', grid: [], lastSaved: new Date() };
    spyOn(component['gridService'], 'saveGrid').and.returnValue(of(newGrid));

    const routerSpy = spyOn(component['router'], 'navigate');

    spyOn(window, 'confirm').and.returnValue(true);

    component.roomID = 'room1';
    component.newGridName = 'New Grid';
    component.newGridRows = 5;
    component.newGridCols = 5;
    component.saveNewGrid();
    tick();

    expect(component['gridService'].saveGrid).toHaveBeenCalled();
    expect(mockRoomService.getGridsByRoomId).toHaveBeenCalledWith('room1');
    expect(routerSpy).toHaveBeenCalledWith([`/${component.roomID}/grid/${newGrid._id}`]);
  }));
});
