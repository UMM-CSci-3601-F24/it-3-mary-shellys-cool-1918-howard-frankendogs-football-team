import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GridComponent } from './grid.component';

describe('GridCellComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [FormsModule, GridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize grid correctly', () => {
    expect(component.grid.length).toBe(component.n);
    for (const row of component.grid) {
      expect(row.length).toBe(component.n);
    }
  });

  it('should re-initialize grid on size input', () => {
    component.n = 5;
    component.onSizeInput();
    expect(component.grid.length).toBe(5);
    for (const row of component.grid) {
      expect(row.length).toBe(5);
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
});