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

describe('max function', () => {
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

  it("max() should return larger of two numbers", () => {
    expect(wordList.max(5,10)).toBe(10);
    expect(wordList.max(8,2)).toBe(8);
    expect(wordList.max(4,4)).toBe(4);

  });
})

