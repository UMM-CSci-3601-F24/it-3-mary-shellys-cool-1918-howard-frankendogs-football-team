import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { MatCardModule } from '@angular/material/card';

import { WordListComponent } from './word-list.component';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { Word } from './word';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Search } from './search';
// import { MatSnackBar } from '@angular/material/snack-bar';

const COMMON_IMPORTS: unknown[] = [
  RouterTestingModule,
  BrowserAnimationsModule,
];

describe('Word List', () => {
  let wordList: WordListComponent;
  let fixture: ComponentFixture<WordListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, WordListComponent],
      providers: [{ provide: WordService, useValue: new MockWordService() }],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(WordListComponent);
      wordList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));
  // general tests
  it('should create', () => {
    expect(wordList).toBeTruthy();
  });
  it('should create context', () => {
    expect(wordList.serverFilteredContext()).toBeTruthy();
  });
  it('contains all the words', () => {
    expect(wordList.filteredWords().length).toBe(5);
  });
  it('contains all the searches', () => {
    expect(wordList.searchHistory().length).toBe(3);
  });
  //specific tests for words
  it("contains a word 'Mac'", () => {
    expect(
      wordList.filteredWords().some((word: Word) => word.word === 'Mac')
    ).toBe(true);
  });
  it('has four words in the group `team member`', () => {
    expect(
      wordList
        .filteredWords()
        .filter((word: Word) => word.wordGroup === 'team member').length
    ).toBe(4);
  });
  it('has one word in the group `teachers`', () => {
    expect(
      wordList
        .filteredWords()
        .filter((word: Word) => word.wordGroup === 'teachers').length
    ).toBe(1);
  });
  //specific tests for searches
  it('has two searches with `contains`', () => {
    expect(
      wordList
        .searchHistory()
        .filter((search: Search) => search.contains !== null).length
    ).toBe(2);
  });
  it('has two searches with `wordGroup`', () => {
    expect(
      wordList
        .searchHistory()
        .filter((search: Search) => search.wordGroup !== null).length
    ).toBe(2);
  });
  it('has one search that looked for contents and word group', () => {
    expect(
      wordList
        .searchHistory()
        .filter(
          (search: Search) =>
            search.wordGroup !== null && search.contains !== null
        ).length
    ).toBe(1);
  });
});

// describe('misbehaving word list', () => {
//   let wordList: WordListComponent;
//   let fixture: ComponentFixture<WordListComponent>;
//   let originalTimeout;
//   let wordServiceStub: {
//     getWords: () => Observable<Word[]>;
//   };
//   beforeEach(() => {
//     wordServiceStub = {
//       getWords: () =>
//         new Observable((observer) => {
//           observer.error('getWords() Observer generates and error');
//         }),
//     };
//     TestBed.configureTestingModule({
//       imports: [WordListComponent, COMMON_IMPORTS],
//       providers: [{ provide: WordService, useValue: wordServiceStub }],
//     });
//   });
//   beforeEach(waitForAsync(() => {
//     TestBed.compileComponents().then(() => {
//       fixture = TestBed.createComponent(WordListComponent);
//       wordList = fixture.componentInstance;
//       fixture.detectChanges();
//     });
//   }));
//   // these two functions are a workaround to build more time
//   //into this test so it does not auto fail when another test fails
//   beforeEach(function () {
//     originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//   });
//   afterEach(function () {
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
//   });
//   it('generates an error if we don`t set up a WordListService', () => {
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//     expect(wordList.serverFilteredContext())
//       .withContext('service cant give values of non-existent list')
//       .toEqual(undefined);
//     expect(wordList.errMsg())
//       .withContext('the error message will be')
//       .toContain('Problem contacting the server – Error Code:');
//   });
// });

// there is no delete word method implemented in the mock word service
// describe('delete Word', () => {
//   let wordList: WordListComponent;
//   let fixture: ComponentFixture<WordListComponent>;
//   const mockSnackbarMock = jasmine.createSpyObj(['open']);
//   mockSnackbarMock.open();

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [COMMON_IMPORTS, WordListComponent],
//       providers: [
//         { provide: WordService, useValue: new MockWordService() },
//         { provide: MatSnackBar, useValue: mockSnackbarMock },
//       ],
//     });
//   });

//   beforeEach(waitForAsync(() => {
//     TestBed.compileComponents().then(() => {
//       fixture = TestBed.createComponent(WordListComponent);
//       wordList = fixture.componentInstance;
//       fixture.detectChanges();
//     });
//   }));

//   it('calls delete word', () => {
//     expect(
//       wordList.filteredWords().filter((word: Word) => word._id === 'Nic_id')
//         .length
//     ).toBe(1);
//     wordList.deleteWord('Nic_id');
//     expect(mockSnackbarMock.open).toHaveBeenCalledWith(
//       `We deleted a word!`,
//       'OK',
//       { duration: 6000 }
//     );
//   });
// });
