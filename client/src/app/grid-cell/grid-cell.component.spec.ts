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

  it('should toggle the boolean for the edge', () => {
    const cell = new GridCellComponent();

    const edges = { top: true, right: false, bottom: true, left: false };
    cell.setEdges(edges);

    expect(cell.gridCell.edges.top).toBeTrue();
    expect(cell.gridCell.edges.right).toBeFalse();
    expect(cell.gridCell.edges.bottom).toBeTrue();
    expect(cell.gridCell.edges.left).toBeFalse();

    cell.toggleEdge('top', true);
    cell.toggleEdge('right', true);
    cell.toggleEdge('bottom', true);
    cell.toggleEdge('left', true);

    expect(cell.gridCell.edges.top).toBeFalse();
    expect(cell.gridCell.edges.right).toBeTrue();
    expect(cell.gridCell.edges.bottom).toBeFalse();
    expect(cell.gridCell.edges.left).toBeTrue();
  });

  it('should bold after ctrl click', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;
    const edges = { top: false, right: false, bottom: false, left: false };
    component.setEdges(edges);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

    inputElement.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(inputElement);

    const event = new MouseEvent('click', {ctrlKey: true });
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    const cellElement: HTMLElement = fixture.nativeElement.querySelector('.cell');
    const cellEditableElement: HTMLElement = fixture.nativeElement.querySelector('.cell-input');
    expect(component.gridCell.edges.top).toBeTrue();
    expect(component.gridCell.edges.left).toBeTrue();
    expect(component.gridCell.edges.right).toBeTrue();
    expect(component.gridCell.edges.bottom).toBeTrue();
    expect(cellElement.classList).toContain('bold-top');
    expect(cellElement.classList).toContain('bold-right');
    expect(cellElement.classList).toContain('bold-bottom');
    expect(cellElement.classList).toContain('bold-left');
    expect(cellEditableElement.classList).toContain('blacked-out');
  });

  it('should un-bold after ctrl click', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;
    const edges = { top: true, right: true, bottom: true, left: true };
    component.setEdges(edges);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

    inputElement.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(inputElement);

    const event = new MouseEvent('click', {ctrlKey: true });
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    const cellElement: HTMLElement = fixture.nativeElement.querySelector('.cell');
    const cellEditableElement: HTMLElement = fixture.nativeElement.querySelector('.cell-input');

    expect(component.gridCell.edges.top).toBeFalse();
    expect(component.gridCell.edges.left).toBeFalse();
    expect(component.gridCell.edges.right).toBeFalse();
    expect(component.gridCell.edges.bottom).toBeFalse();
    expect(cellElement.classList).not.toContain('bold-top');
    expect(cellElement.classList).not.toContain('bold-right');
    expect(cellElement.classList).not.toContain('bold-bottom');
    expect(cellElement.classList).not.toContain('bold-left');
    expect(cellEditableElement.classList).not.toContain('blacked-out');
  });

  it('should keep bold edges but un-bold background on alt click', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;
    const edges = { top: false, right: false, bottom: false, left: false };
    component.setEdges(edges);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

    inputElement.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(inputElement);

    const event = new MouseEvent('click', {ctrlKey: true });
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    const eventAlt = new MouseEvent('click', {altKey: true });
    inputElement.dispatchEvent(eventAlt);
    fixture.detectChanges();

    const cellElement: HTMLElement = fixture.nativeElement.querySelector('.cell');
    const cellEditableElement: HTMLElement = fixture.nativeElement.querySelector('.cell-input');
    expect(component.gridCell.edges.top).toBeTrue();
    expect(component.gridCell.edges.left).toBeTrue();
    expect(component.gridCell.edges.right).toBeTrue();
    expect(component.gridCell.edges.bottom).toBeTrue();
    expect(component.gridCell.color).toContain('white');
    expect(cellElement.classList).toContain('bold-top');
    expect(cellElement.classList).toContain('bold-right');
    expect(cellElement.classList).toContain('bold-bottom');
    expect(cellElement.classList).toContain('bold-left');
    expect(cellEditableElement.classList).not.toContain('blacked-out');
  });

  it('should disallow input into the cell', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;

    component.setEditable(false);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement).toBeNull();
  });

  it('should disallow contextmenu when in cell', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;
    component.setEditable(true);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    inputElement.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(inputElement);

    const event = new MouseEvent('click', { button: 2 });
    spyOn(event, 'preventDefault');
    component.onRightClick(event);
    fixture.detectChanges();

    expect(event.preventDefault).toHaveBeenCalled();
  });


  it('should disallow invalid input into the cell', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;

    component.setEditable(true);
    fixture.detectChanges();
    component.onInput("/");
    expect(component.gridCell.value).toBe('');
  });

  it('should allow valid input into the cell', () => {
    const fixture = TestBed.createComponent(GridCellComponent);
    const component = fixture.componentInstance;

    component.setEditable(true);
    fixture.detectChanges();
    component.onInput("a");
    expect(component.gridCell.value).toBe('a');
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

    event = new KeyboardEvent('keydown', { key: 'ArrowUp', ctrlKey: true });
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
