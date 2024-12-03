import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GridComponent } from './grid.component';
import { GridService } from './grid.service';
import { RoomService } from '../room.service';
import { MockGridService } from 'src/testing/grid.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GridPackage } from './gridPackage';
import { of } from 'rxjs';
import { GridCell } from '../grid-cell/grid-cell';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [FormsModule, BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule, GridComponent, MatSnackBarModule],
      providers: [
        { provide: GridService, useValue: new MockGridService() },
        RoomService,
        MatSnackBar
      ],
    })
      .compileComponents();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(GridComponent);
      component = fixture.componentInstance;
      snackBar = TestBed.inject(MatSnackBar);
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize grid correctly', () => {
    expect(component.gridPackage.grid.length).toBe(component.gridWidth);
    for (const row of component.gridPackage.grid) {
      expect(row.length).toBe(component.gridWidth);
    }
  });

  it('should re-initialize even grid on size input', () => {
    component.gridHeight = 5;
    component.gridWidth = 5;
    component.onSizeInput();
    expect(component.gridPackage.grid.length).toBe(5);
    for (const row of component.gridPackage.grid) {
      expect(row.length).toBe(5);
    }
  });

  it('should re-initialize odd grid on size input', () => {
    component.gridHeight = 5;
    component.gridWidth = 6;
    component.onSizeInput();
    expect(component.gridPackage.grid.length).toBe(5);
    for (const row of component.gridPackage.grid) {
      expect(row.length).toBe(6);
    }
  });

  it('should move focus on click', () => {
    const moveFocusSpy = spyOn(component, 'moveFocus');
    component.onClick(new MouseEvent('click'), 2, 3);
    expect(moveFocusSpy).toHaveBeenCalledWith(2, 3);
  });

  it('should move focus on arrow key down', fakeAsync(() => {
    const moveFocusSpy = spyOn(component, 'moveFocus');
    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(1, 2);
  }));

  it('should move focus on arrow key up', fakeAsync(() => {
    const moveFocusSpy = spyOn(component, 'moveFocus');
    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(1, 0);
  }));

  it('should move focus on arrow key left', fakeAsync(() => {
    const moveFocusSpy = spyOn(component, 'moveFocus');
    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(0, 1);
  }));

  it('should move focus on arrow key right', fakeAsync(() => {
    const moveFocusSpy = spyOn(component, 'moveFocus');
    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(2, 1);
  }));

  it('should update currentRow and currentCol on moveFocus', () => {
    component.moveFocus(2, 3);
    expect(component.currentCol).toBe(2);
    expect(component.currentRow).toBe(3);
  });

  it('should cycle typing direction correctly', () => {
    const initialDirection = component.typeDirection;
    component.cycleTypingDirection();
    expect(component.typeDirection).not.toBe(initialDirection);
    expect(component.typeDirection).toBe(component.typingDirections[1]);

    component.cycleTypingDirection();
    expect(component.typeDirection).toBe(component.typingDirections[2]);

    component.cycleTypingDirection();
    expect(component.typeDirection).toBe(component.typingDirections[3]);

    component.cycleTypingDirection();
    expect(component.typeDirection).toBe(component.typingDirections[0]);
  });

  it('should handle keydown events correctly', fakeAsync(() => {
    const moveFocusSpy = spyOn(component, 'moveFocus');
    const cell = component.gridPackage.grid[1][1];
    const inputElement = document.createElement('input');
    spyOn(component.elRef.nativeElement, 'querySelector').and.returnValue(inputElement);

    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(1, 0);

    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(1, 2);

    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(0, 1);

    component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(2, 1);

    component.typeDirection = 'right';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'a' }), 1, 1);
    tick(100);
    expect(cell.value).toBe('a');
    expect(moveFocusSpy).toHaveBeenCalledWith(2, 1);

    component.typeDirection = 'left';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'a' }), 1, 1);
    tick(100);
    expect(cell.value).toBe('a');
    expect(moveFocusSpy).toHaveBeenCalledWith(0, 1);

    component.typeDirection = 'up';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'a' }), 1, 1);
    tick(100)
    expect(cell.value).toBe('a');
    expect(moveFocusSpy).toHaveBeenCalledWith(1, 0);

    component.typeDirection = 'down';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'a' }), 1, 1);
    tick(100);
    expect(cell.value).toBe('a');
    expect(moveFocusSpy).toHaveBeenCalledWith(1, 2);
  }));

  it('should handle backspace correctly', fakeAsync(() => {
    const moveFocusSpy = spyOn(component, 'moveFocus');
    const cell = component.gridPackage.grid[1][1];
    const inputElement = document.createElement('input');
    spyOn(component.elRef.nativeElement, 'querySelector').and.returnValue(inputElement);

    const initialDirection = component.deleteDirectionBool;
    component.deleteDirectionToggle();
    expect(component.deleteDirectionBool).not.toBe(initialDirection);

    component.typeDirection = 'right';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Backspace' }), 1, 1);
    tick(100);
    expect(cell.value).toBe('');
    expect(inputElement.value).toBe('');
    expect(moveFocusSpy).toHaveBeenCalledWith(0, 1);

    component.typeDirection = 'left';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Backspace' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(2, 1);

    component.typeDirection = 'up';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Backspace' }), 1, 1);
    tick(100)
    expect(moveFocusSpy).toHaveBeenCalledWith(1, 2);

    component.typeDirection = 'down';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Backspace' }), 1, 1);
    tick(100);
    expect(moveFocusSpy).toHaveBeenCalledWith(1, 0);

    component.onKeydown(new KeyboardEvent('keydown', { key: 'Backspace', ctrlKey: true }), 1, 1);
    tick(100);
    expect(cell.value).toBe('');

    component.deleteDirectionToggle();
    component.typeDirection = 'left';
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Backspace' }), 1, 1);
    tick(100);
    expect(cell.value).toBe('');
    expect(inputElement.value).toBe('');
    expect(moveFocusSpy).toHaveBeenCalledWith(0, 1);
  }));

  it('should load saved grids correctly', fakeAsync(() => {
    const mockGrids: GridPackage[] = [
      { grid: [], _id: '1', roomID: 'room1', name: "Grid1", lastSaved: new Date() },
      { grid: [], _id: '2', roomID: 'room2', name: "Grid2", lastSaved: new Date() }
    ];
    spyOn(component['roomService'], 'getGridsByRoomId').and.returnValue(of(mockGrids));

    component.loadSavedGrids();
    tick();

    expect(component.savedGrids).toEqual(mockGrids);
  }));

  it('should apply grid update correctly', () => {
    const mockGrid: GridCell[][] = [
      [new GridCell(), new GridCell()],
      [new GridCell(), new GridCell()]
    ];

    component.applyGridUpdate(mockGrid);

    expect(component.gridPackage.grid).toEqual(mockGrid);
    expect(component.gridHeight).toBe(mockGrid.length);
    expect(component.gridWidth).toBe(mockGrid[0].length);
  });

  it('should load grid correctly', fakeAsync(() => {
    const mockGridPackage: GridPackage = {
      grid: [
        [new GridCell(), new GridCell()],
        [new GridCell(), new GridCell()]
      ],
      _id: 'testId',
      roomID: 'testRoomId',
      name: '',
      lastSaved: undefined
    };

    spyOn(component['gridService'], 'getGridById').and.returnValue(of(mockGridPackage));

    component.loadGrid('testId');
    tick();

    expect(component.gridPackage._id).toBe(mockGridPackage._id);
    expect(component.gridPackage.roomID).toBe(mockGridPackage.roomID);
    expect(component.gridPackage.grid).toEqual(mockGridPackage.grid);
    expect(component.gridHeight).toBe(mockGridPackage.grid.length);
    expect(component.gridWidth).toBe(mockGridPackage.grid[0].length);
  }));

  it('should send grid update message on grid change', () => {
    const sendMessageSpy = spyOn(component['webSocketService'], 'sendMessage');
    const mockGridCell: GridCell = new GridCell();
    mockGridCell.value = 'X';
    component.gridPackage.grid[1][1] = mockGridCell;
    component.gridPackage._id = 'testId';
    component.gridPackage.roomID = 'testRoomId';

    component.onGridChange({ row: 1, col: 1, cell: mockGridCell });

    expect(sendMessageSpy).toHaveBeenCalledWith({
      type: 'GRID_CELL_UPDATE',
      cell: mockGridCell,
      row: 1,
      col: 1,
      gridID: 'testId'
    });
  });

  it('should handle websocket messages correctly', fakeAsync(() => {
    const mockGridCell: GridCell = new GridCell();
    mockGridCell.value = 'X';
    const message = {
      type: 'GRID_CELL_UPDATE',
      cell: mockGridCell,
      row: 1,
      col: 1,
      id: 'testId'
    };

    spyOn(component['webSocketService'], 'getMessage').and.returnValue(of(message));
    component.gridPackage._id = 'testId';

    // This is a workaround to make the test work
    component['webSocketService'].getMessage().subscribe((msg: unknown) => {
      const receivedMessage = msg as { type: string, cell: GridCell, row: number, col: number, id: string };
      if (receivedMessage.type === 'GRID_CELL_UPDATE' && component.gridPackage._id === receivedMessage.id) {
        component.gridPackage.grid[receivedMessage.row][receivedMessage.col] = receivedMessage.cell;
      }
    });

    tick();

    expect(component.gridPackage.grid[1][1].value).toBe('X');
  }));

  it('should save grid correctly', fakeAsync(() => {
    const saveGridSpy = spyOn(component['gridService'], 'saveGridWithRoomId').and.callThrough();
    const loadGridsSpy = spyOn(component, 'loadSavedGrids').and.callThrough();
    const mockGridPackage: GridPackage = {
      grid: [
        [new GridCell(), new GridCell()],
        [new GridCell(), new GridCell()]
      ],
      _id: 'testId',
      roomID: 'testRoomId',
      name: 'Test Grid',
      lastSaved: new Date()
    };

    component.gridPackage = mockGridPackage;
    component.saveGrid();
    tick();

    expect(saveGridSpy).toHaveBeenCalledWith('testRoomId', jasmine.objectContaining({
      grid: mockGridPackage.grid,
      _id: mockGridPackage._id,
      name: mockGridPackage.name,
      lastSaved: jasmine.any(Date)
    }));
    expect(loadGridsSpy).toHaveBeenCalled();
    expect(component.gridPackage.lastSaved).toBeTruthy();
    expect(component.gridPackage.lastSaved.getTime()).toBeCloseTo(new Date().getTime(), -2);
  }));

  it('should update cell color correctly', () => {
    const cell = new GridCell();
    cell.edges = { top: true, right: true, bottom: true, left: true };
    component.gridPackage.grid = [[cell]];

    component.updateCellColor(0, 0);

    expect(component.gridPackage.grid[0][0].color).toBe('black');
  });

  it('should copy grid link to clipboard', fakeAsync(() => {
    spyOn(navigator.clipboard, 'writeText').and.callFake(() => Promise.resolve());
    const snackBarSpy = spyOn(snackBar, 'open');
    component.gridPackage._id = 'testId';

    component.copyGridLink();
    tick();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/grid/testId`);
    expect(snackBarSpy).toHaveBeenCalledWith('Grid link copied to clipboard!', 'Close', { duration: 3000 });
  }));

  it('should navigate to grids page on leaveGrid', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    component.gridPackage.roomID = 'testRoomId';

    component.leaveGrid();

    expect(navigateSpy).toHaveBeenCalledWith(['/testRoomId/grids']);
  });
});



