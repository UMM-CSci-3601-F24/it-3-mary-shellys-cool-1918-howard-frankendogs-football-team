import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WordGroupProfileComponent } from './word-group-profile.component';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { ActivatedRoute } from '@angular/router';
import { Word } from './word';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const COMMON_IMPORTS: unknown[] = [RouterTestingModule, BrowserAnimationsModule];

describe('WordGroupProfileComponent', () => {
  let wordGroupProfile: WordGroupProfileComponent;
  let fixture: ComponentFixture<WordGroupProfileComponent>;
  const wordGroup = 'My Words';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    id: wordGroup,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WordGroupProfileComponent, COMMON_IMPORTS],
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

  it("should navigate to specific wordfile:///home/and10393/Desktop/it-3-mary-shellys-cool-1918-howard-frankendogs-football-team/client/coverage/client/src/app/anagram/word-list.component.ts.html group profile", ()=> {
    const desiredGroup: Word[] = MockWordService.wordsInGroup;
    /*
    From lab 4, test "should navigate to a specific user profile":
    setting the param map should update the component
    bc the component is subscribed to the map
    */
    activatedRoute.setParamMap({id: desiredGroup[0].wordGroup})
    expect(wordGroupProfile.words()).toEqual(desiredGroup);
  });

  it('should not blow up when calling deleteWord()', () => {
    // This is a smoke test, just testing that the world does not blow up
    wordGroupProfile.deleteWord("Bad Word");
    fixture.detectChanges();
    fixture.isStable();
  });
});
