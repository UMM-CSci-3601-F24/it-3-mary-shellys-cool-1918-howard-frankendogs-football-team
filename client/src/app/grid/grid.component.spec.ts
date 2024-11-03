import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GridComponent } from './grid.component';
import { GridService } from './grid.service';
import { MockGridService } from 'src/testing/grid.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Grid } from './grid';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('GridCellComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let gridService: MockGridService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [FormsModule, GridComponent, RouterTestingModule],
      providers: [{ provide: GridService, useValue: new MockGridService() }],
    })
      .compileComponents();
  });
  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(GridComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      gridService = TestBed.inject(GridService);
    })
  }))

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize grid correctly', () => {
    expect(component.grid.length).toBe(component.colWidth);
    for (const row of component.grid) {
      expect(row.length).toBe(component.colWidth);
    }
  });

  it('should re-initialize even grid on size input', () => {
    component.rowHight = 5;
    component.colWidth = 5;
    component.onSizeInput();
    expect(component.grid.length).toBe(5);
    for (const row of component.grid) {
      expect(row.length).toBe(5);
    }
  });

  it('should re-initialize odd grid on size input', () => {
    component.rowHight = 5;
    component.colWidth = 6;
    component.onSizeInput();
    expect(component.grid.length).toBe(5);
    for (const row of component.grid) {
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
    const cell = component.grid[1][1];
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
    const cell = component.grid[1][1];
    const inputElement = document.createElement('input');
    spyOn(component.elRef.nativeElement, 'querySelector').and.returnValue(inputElement);

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
  }));

  it('saveGrid() should call grid service and load grids', fakeAsync(() => {
    const partialGrid: Partial<Grid> = {
      owner: 'currentUser',
      grid: component.grid
    };

    const saveGridSpy = spyOn(gridService, 'saveGrid').and.returnValue(of('newGridId'));
    const loadSavedGridsSpy = spyOn(component, 'loadSavedGrids');

    component.saveGrid();
    tick();

    expect(saveGridSpy).toHaveBeenCalledWith(partialGrid);
    expect(loadSavedGridsSpy).toHaveBeenCalled();

    component.loadSavedGrids();
    expect(loadSavedGridsSpy).toHaveBeenCalled();
  }));

  it('should call saveGrid and loadSavedGrids when save button is clicked', fakeAsync(() => {
    const saveButton = fixture.debugElement.query(By.css('.save-button'));
    const saveGridSpy = spyOn(component, 'saveGrid').and.callThrough();
    const loadSavedGridsSpy = spyOn(component, 'loadSavedGrids').and.callThrough();

    saveButton.triggerEventHandler('click', null);
    tick();

    expect(saveGridSpy).toHaveBeenCalled();
    expect(loadSavedGridsSpy).toHaveBeenCalled();

  }));
});



