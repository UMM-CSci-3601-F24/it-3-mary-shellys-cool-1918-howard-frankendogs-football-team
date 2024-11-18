import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomGridsComponent } from './room-grids.component';

describe('RoomGridsComponent', () => {
  let component: RoomGridsComponent;
  let fixture: ComponentFixture<RoomGridsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomGridsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomGridsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
