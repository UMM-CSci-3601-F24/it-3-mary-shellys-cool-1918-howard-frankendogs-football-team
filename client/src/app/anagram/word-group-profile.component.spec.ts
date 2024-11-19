import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordGroupProfileComponent } from './word-group-profile.component';

describe('WordGroupProfileComponent', () => {
  let component: WordGroupProfileComponent;
  let fixture: ComponentFixture<WordGroupProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordGroupProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordGroupProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
