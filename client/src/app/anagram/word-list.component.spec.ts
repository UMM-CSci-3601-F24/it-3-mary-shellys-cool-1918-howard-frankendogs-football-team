import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WordListComponent } from './word-list.component';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { Word } from './word';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Search } from './search';
import { RouterTestingModule } from '@angular/router/testing';

const COMMON_IMPORTS: unknown[] = [
  RouterTestingModule,
  BrowserAnimationsModule,
  HttpClientTestingModule,
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
  it("deletes a word 'Keenan'", () => {
    wordList.deleteWord("Keenan_id");
    fixture.detectChanges();
    expect(wordList.serverFilteredContext().words.length).toBe(4);
    expect(wordList.filteredWords().length).toBe(4);
    expect(
      wordList.filteredWords().some((word: Word) => word.word === 'Keenan')
    ).toBe(false);
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
  // deleteWordGroup() smoke test for snack bar
  it('should not blow up when calling deleteWord()', () => {
    // This is a smoke test, just testing that the world does not blow up
    expect(wordList.forceUpdate()).toEqual(0);
    wordList.deleteWordGroup("BadWords");
    fixture.detectChanges();
    fixture.isStable();
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

