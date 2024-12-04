import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Clipboard } from '@angular/cdk/clipboard';
import { of } from 'rxjs';

describe('Home', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let clipboardSpy: jasmine.SpyObj<Clipboard>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    clipboardSpy = jasmine.createSpyObj('Clipboard', ['copy']);
    TestBed.configureTestingModule({
      imports: [MatCardModule, ReactiveFormsModule, HttpClientTestingModule, HomeComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Clipboard, useValue: clipboardSpy }
      ]
    });

    fixture = TestBed.createComponent(HomeComponent);

    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a room', () => {
    const mockResponse = { id: '12345' };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    component.createRoom();
    expect(httpClientSpy.post).toHaveBeenCalledWith('/api/rooms', { name: '' });
    expect(component.createdRoomId).toBe(mockResponse.id);
  });

  it('should copy the link', () => {
    component.createdRoomId = '12345';
    const expectedLink = `${window.location.origin}/12345/grids`;

    component.copyLink();
    expect(clipboardSpy.copy).toHaveBeenCalledWith(expectedLink);
  });

});
