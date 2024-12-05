import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RoomService } from '../room.service';

import { GridListComponent } from './grid-list.component';
import { GridPackage } from './gridPackage';
import { GridService } from './grid.service';
import { MockGridService } from 'src/testing/grid.service.mock';

describe('GridListComponent', () => {
  let component: GridListComponent;
  let fixture: ComponentFixture<GridListComponent>;
  let roomService: jasmine.SpyObj<RoomService>;

  beforeEach(async () => {
    roomService = jasmine.createSpyObj('RoomService', ['getGridsByRoomId']);
    await TestBed.configureTestingModule({
      imports: [GridListComponent, RouterTestingModule],
      providers: [
        { provide: RoomService, useValue: roomService },
        { provide: GridService, useValue: new MockGridService() }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load grids based on roomID', () => {
    const mockGrids: GridPackage[] = [
      { _id: '1', name: 'Grid 1', roomID: 'room1', grid: [], lastSaved: new Date() },
      { _id: '2', name: 'Grid 2', roomID: 'room2', grid: [], lastSaved: new Date() }
    ];
    roomService.getGridsByRoomId.and.returnValue(of(mockGrids));
    component.roomID = '123';
    component.loadGrids();
    expect(roomService.getGridsByRoomId).toHaveBeenCalledWith('123');
    expect(component.grids).toEqual(mockGrids);
  });

  it('should remove the grid with the given ID from the list', () => {
    component.grids = [
      { _id: '1', name: 'Grid 1', roomID: 'room1', grid: [], lastSaved: new Date() },
      { _id: '2', name: 'Grid 2', roomID: 'room2', grid: [], lastSaved: new Date() }
    ];
    component.onGridDeleted('1');
    expect(component.grids.length).toBe(1);
    expect(component.grids[0]._id).toBe('2');
  });
});
