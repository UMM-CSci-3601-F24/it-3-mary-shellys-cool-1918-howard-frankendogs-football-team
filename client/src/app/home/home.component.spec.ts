import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Home', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, ReactiveFormsModule, HttpClientTestingModule, HomeComponent],
    });

    fixture = TestBed.createComponent(HomeComponent);

    component = fixture.componentInstance; // BannerComponent test instance

    // query for the link (<a> tag) by CSS element selector
    de = fixture.debugElement.query(By.css('.home-card'));
    el = de.nativeElement;
  });

  it('It has the basic home page text', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain('This is a home page! It doesn\'t do anything!');
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct text content', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain('This is a home page! It doesn\'t do anything!');
  });

  it('should create a room and display the room ID', () => {
    component.roomForm.controls['name'].setValue('Test Room');
    component.createRoom();
    fixture.detectChanges();
    expect(component.createdRoomId).toBeTruthy();
  });
});
