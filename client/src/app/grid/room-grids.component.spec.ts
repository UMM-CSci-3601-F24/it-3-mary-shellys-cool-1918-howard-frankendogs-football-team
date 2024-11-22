import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GridListComponent } from './grid-list.component';
import { GridService } from './grid.service';

describe('GridListComponent', () => {
  let component: GridListComponent;
  let fixture: ComponentFixture<GridListComponent>;
  let httpTestingController: HttpTestingController;
  let mockGridService: jasmine.SpyObj<GridService>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('GridService', ['getGrids']);
    mockGridService.getGrids.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        GridListComponent
      ],
      providers: [
        { provide: GridService, useValue: mockGridService }
      ]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(GridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});