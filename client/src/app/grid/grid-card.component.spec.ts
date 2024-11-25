import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GridService } from './grid.service';
import { GridPackage } from './gridPackage';
import { of } from 'rxjs';

import { GridCardComponent } from './grid-card.component';

describe('GridCardComponent', () => {
  let component: GridCardComponent;
  let fixture: ComponentFixture<GridCardComponent>;
  let gridService: GridService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCardComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [GridService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridCardComponent);
    component = fixture.componentInstance;
    gridService = TestBed.inject(GridService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit gridDeleted event on delete', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(gridService, 'deleteGrid').and.returnValue(of({ deletedId: '123' }));
    spyOn(component.gridDeleted, 'emit');

    component.gridPackage = { _id: '123', name: 'Test Grid', grid: [[]] } as GridPackage;
    component.deleteGrid(new Event('click'));

    expect(gridService.deleteGrid).toHaveBeenCalledWith('123');
    expect(component.gridDeleted.emit).toHaveBeenCalledWith('123');
  });

  it('should not emit gridDeleted event if delete is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(gridService, 'deleteGrid');
    spyOn(component.gridDeleted, 'emit');

    component.gridPackage = { _id: '123', name: 'Test Grid', grid: [[]] } as GridPackage;
    component.deleteGrid(new Event('click'));

    expect(gridService.deleteGrid).not.toHaveBeenCalled();
    expect(component.gridDeleted.emit).not.toHaveBeenCalled();
  });
});
