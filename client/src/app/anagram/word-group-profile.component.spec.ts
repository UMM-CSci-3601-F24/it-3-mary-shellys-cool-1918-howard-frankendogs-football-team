import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WordGroupProfileComponent } from './word-group-profile.component';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { ActivatedRoute } from '@angular/router';
import { Word } from './word';
import { PageEvent } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const COMMON_IMPORTS: unknown[] = [RouterTestingModule];

describe('WordGroupProfileComponent', () => {
  let wordGroupProfile: WordGroupProfileComponent;
  let fixture: ComponentFixture<WordGroupProfileComponent>;
  const wordGroup = 'My Words';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    id: wordGroup,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WordGroupProfileComponent, BrowserAnimationsModule, COMMON_IMPORTS],
      providers: [
        { provide: WordService, useValue: new MockWordService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordGroupProfileComponent);
    wordGroupProfile = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(wordGroupProfile).toBeTruthy();
  });

  it('should return words in a word group', () => {
    expect(wordGroupProfile.words()).toBeTruthy();
  });

  it("should navigate to specific word group profile", ()=> {
    const desiredGroup: Word[] = MockWordService.wordsInGroup;
    /*
    From lab 4, test "should navigate to a specific user profile":
    setting the param map should update the component
    bc the component is subscribed to the map
    */
    activatedRoute.setParamMap({id: desiredGroup[0].wordGroup})
    expect(wordGroupProfile.words()).toEqual(desiredGroup);
  });

  it('should update page number and size on page event', () => {
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 } as PageEvent;
    wordGroupProfile.handlePageEvent(pageEvent);
    expect(wordGroupProfile.pageNumber()).toBe(1);
    expect(wordGroupProfile.pageSize()).toBe(10);
  });

  it('should display correct number of words per page', () => {
    wordGroupProfile.pageSize.set(2);
    wordGroupProfile.pageNumber.set(0);
    expect(wordGroupProfile.displayWords().length).toBe(2);

    wordGroupProfile.pageNumber.set(1);
    expect(wordGroupProfile.displayWords().length).toBe(2);
  });
});
