import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GridService } from './grid.service';
import { RoomGridsComponent } from './room-grids.component';
import { Router } from '@angular/router';

describe('GridListComponent', () => {
  let component: RoomGridsComponent;
  let fixture: ComponentFixture<RoomGridsComponent>;
  let httpTestingController: HttpTestingController;
  let mockGridService: jasmine.SpyObj<GridService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockGridService = jasmine.createSpyObj('GridService', ['getGrids']);
    mockGridService.getGrids.and.returnValue(of([]));
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        RoomGridsComponent
      ],
      providers: [
        { provide: GridService, useValue: mockGridService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RoomGridsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should copy room link to clipboard', () => {
    const component = fixture.componentInstance;
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    spyOn(window, 'alert');
    component.copyRoomLink();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/room/${component.roomID}`);
    expect(window.alert).toHaveBeenCalledWith('Room link copied to clipboard!');
  });

  it('should navigate to home on exitRoom', () => {
    const component = fixture.componentInstance;
    component.exitRoom();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
