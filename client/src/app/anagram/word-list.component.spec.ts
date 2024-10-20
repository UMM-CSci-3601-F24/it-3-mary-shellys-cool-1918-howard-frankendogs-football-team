import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { MatCardModule } from '@angular/material/card';

import { WordListComponent } from './word-list.component';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { Word } from './word';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

const COMMON_IMPORTS: unknown[] = [
  RouterTestingModule,
  BrowserAnimationsModule,
]

describe('Word List', () => {
  let wordList: WordListComponent;
  let fixture: ComponentFixture<WordListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, WordListComponent],
      providers: [{provide: WordService, useValue: new MockWordService() }],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(WordListComponent);
      wordList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(wordList).toBeTruthy();
  });
  it('contains all the words', () => {
    expect(wordList.serverFilteredWords().length).toBe(5);
  })
  it("contains a word 'Mac'", () => {
    expect(
      wordList.serverFilteredWords().some((word: Word) => word.word === 'Mac')
    ).toBe(true);
  });
  it('has four words in the group `team member`', () => {
    expect(
      wordList.serverFilteredWords().filter((word: Word) => word.wordGroup === "team member").length
    ).toBe(4);
  });
  it('has one word in the group `teachers`', () => {
    expect(
      wordList.serverFilteredWords().filter((word: Word) => word.wordGroup === "teachers").length
    ).toBe(1);
  });
});

describe('misbehaving word list', () => {
  let wordList: WordListComponent;
  let fixture: ComponentFixture<WordListComponent>;
  let originalTimeout;

  let wordServiceStub: {
    getWords: () => Observable<Word[]>;
  };

  beforeEach(() => {
    wordServiceStub = {
      getWords: () =>
        new Observable((observer) => {
          observer.error('getWords() Observer generates and error');
        }),
    };
    TestBed.configureTestingModule({
      imports: [WordListComponent, COMMON_IMPORTS],
      providers: [{provide: WordService, useValue: wordServiceStub}],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(WordListComponent);
      wordList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  // these two functions are a workaround to build more time
  //into this test so it does not auto fail when another test fails
  beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('generates an error if we don`t set up a WordListService', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    expect(wordList.serverFilteredWords())
      .withContext('service cant give values of non-existent list')
      .toEqual([]);
    expect(wordList.errMsg())
      .withContext('the error message will be')
      .toContain('Problem contacting the server – Error Code:');
  });
});

// there is no delete word method implemented in the mock word service
// describe('delete Word', () => {
//   let wordList: WordListComponent;
//   let fixture: ComponentFixture<WordListComponent>;


//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [COMMON_IMPORTS, WordListComponent],
//       providers: [{provide: WordService, useValue: new MockWordService() }],
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
//       wordList.serverFilteredWords().some((word: Word) => word._id === 'Nic_id')
//     ).toBe(true);
//     wordList.deleteWord("Nic_id");
//     expect(
//       wordList.serverFilteredWords().some((word: Word) => word._id === 'Nic_id')
//     ).toBe(false);
//     });
// })
