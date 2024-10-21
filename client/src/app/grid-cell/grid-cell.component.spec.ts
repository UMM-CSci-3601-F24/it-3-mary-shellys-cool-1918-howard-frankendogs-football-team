import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GridCellComponent } from './grid-cell.component';

describe('GridCellComponent', () => {
  let component: GridCellComponent;
  let fixture: ComponentFixture<GridCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [FormsModule, GridCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a cell with bolded edges', () => {
    const cell = new GridCellComponent();

    const edges = { top: true, right: false, bottom: true, left: false };
    cell.setEdges(edges);

    expect(cell.gridCell.edges.top).toBeTrue();
    expect(cell.gridCell.edges.right).toBeFalse();
    expect(cell.gridCell.edges.bottom).toBeTrue();
    expect(cell.gridCell.edges.left).toBeFalse();
  });

  it('should allow input into the cell', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;

    component.setEditable(true);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement).not.toBeNull();

    inputElement.value = 'A';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.gridCell.value).toBe('A');
  });

  it('should disallow input into the cell', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;

    component.setEditable(false);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement).toBeNull();
  });

  it('should disallow invalid input into the cell', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;

    component.setEditable(true);
    fixture.detectChanges();
    component.onInput("/");
    expect(component.gridCell.value).toBe('');
  });

  it('should apply correct SCSS style class for bolded edges', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;

    const edges = { top: true, right: false, bottom: true, left: true };
    component.setEdges(edges);
    fixture.detectChanges();

    const cellElement: HTMLElement = fixture.nativeElement.querySelector('.cell');

    expect(cellElement.classList).toContain('bold-top');
    expect(cellElement.classList).not.toContain('bold-right');
    expect(cellElement.classList).toContain('bold-bottom');
    expect(cellElement.classList).toContain('bold-left');
  });

  it('should not toggle any edges on key down with Ctrl when an unhandled key is pressed', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;
    const edges = { top: false, right: false, bottom: false, left: false };
    component.setEdges(edges);
    component.setEditable(true);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    inputElement.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(inputElement);

    const event = new KeyboardEvent('keydown', { key: 'A', ctrlKey: true });
    spyOn(event, 'preventDefault');
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.gridCell.edges.top).toBeFalse();
    expect(component.gridCell.edges.right).toBeFalse();
    expect(component.gridCell.edges.bottom).toBeFalse();
    expect(component.gridCell.edges.left).toBeFalse();
  });

  it('should bold edges based on input', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;

    const edges = { top: true, right: false, bottom: true, left: true };
    component.setEdges(edges);
    fixture.detectChanges();

    const cellElement: HTMLElement = fixture.nativeElement.querySelector('.cell');

    expect(cellElement.classList).toContain('bold-top');
    expect(cellElement.classList).not.toContain('bold-right');
    expect(cellElement.classList).toContain('bold-bottom');
    expect(cellElement.classList).toContain('bold-left');
  });

  it('should toggle bolded edges on key down with Ctrl when input is focused', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;
    const edges = { top: false, right: false, bottom: false, left: false };
    component.setEdges(edges);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

    inputElement.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(inputElement);

    let event = new KeyboardEvent('keydown', { key: 'ArrowUp', ctrlKey: true });
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    const cellElement: HTMLElement = fixture.nativeElement.querySelector('.cell');
    expect(component.gridCell.edges.top).toBeTrue();
    expect(cellElement.classList).toContain('bold-top');
    expect(cellElement.classList).not.toContain('bold-right');
    expect(cellElement.classList).not.toContain('bold-bottom');
    expect(cellElement.classList).not.toContain('bold-left');

    event = new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true });

    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.gridCell.edges.top).toBeTrue();
    expect(cellElement.classList).toContain('bold-top');
    expect(cellElement.classList).toContain('bold-right');
    expect(cellElement.classList).not.toContain('bold-bottom');
    expect(cellElement.classList).not.toContain('bold-left');

    event = new KeyboardEvent('keydown', { key: 'ArrowDown', ctrlKey: true });

    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.gridCell.edges.top).toBeTrue();
    expect(cellElement.classList).toContain('bold-top');
    expect(cellElement.classList).toContain('bold-right');
    expect(cellElement.classList).toContain('bold-bottom');
    expect(cellElement.classList).not.toContain('bold-left');

    event = new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true });

    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.gridCell.edges.top).toBeTrue();
    expect(cellElement.classList).toContain('bold-top');
    expect(cellElement.classList).toContain('bold-right');
    expect(cellElement.classList).toContain('bold-bottom');
    expect(cellElement.classList).toContain('bold-left');
  });
});
