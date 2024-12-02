import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WordGroupProfileComponent } from './word-group-profile.component';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { ActivatedRoute } from '@angular/router';
import { Word } from './word';

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

  describe('delete word', () => {
    it('should return snackbar with correct message after word is deleted', () => {
      spyOn(wordGroupProfile.snackBar, 'open');
      wordGroupProfile.deleteWord(MockWordService.testWords[0]._id);
      expect(wordGroupProfile.snackBar.open).toHaveBeenCalledWith('You deleted a word! \n Please refresh your page.','OK', {duration: 6000});

      // const mockSnackBarMessage = {message: `You deleted a word! \n Please refresh your page.`, status: 'OK', duration: 6000};
      // const deleteWordSpy = spyOn(wordGroupProfile, 'deleteWord').and.returnValue(new MatSnackBar() => mockSnackBarMessage);
    });

  })
});
