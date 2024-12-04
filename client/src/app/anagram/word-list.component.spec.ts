import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WordListComponent } from './word-list.component';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { Word } from './word';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Search } from './search';
import { RouterTestingModule } from '@angular/router/testing';
import { PageEvent } from '@angular/material/paginator';

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
});

describe('support functions', () => {
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

  it('update params() should update params from undefined to new params', () => {
    expect(wordList.contains()).toBe('');
    expect(wordList.group()).toBe(undefined);
    wordList.updateParams("hehe", "haha");
    expect(wordList.contains()).toBe("hehe");
    expect(wordList.group()).toBe("haha");
  });

  it('updateParams() can clear params', () => {
    //tests updateParams when pass (null, null)
    wordList.updateParams("contains", "group");
    wordList.updateParams(null, null);
    expect(wordList.contains()).toBeNull();
    expect(wordList.group()).toBe(null);
    //tests updateParams when pass no params
    wordList.updateParams("contains", "group");
    wordList.updateParams();
    expect(wordList.contains()).toBe(null);
    expect(wordList.group()).toBe(null);
  });

  it('updateParams() handles updating one params', () => {
    //tests passing in just a contains param
    wordList.updateParams("contains", "group");
    wordList.updateParams("contains2");
    expect(wordList.contains()).toBe("contains2");
    expect(wordList.group()).toBeNull();
    //tests passing in just a contains param in different format
    wordList.updateParams("contains", "group");
    wordList.updateParams("contains2", null);
    expect(wordList.contains()).toBe("contains2");
    expect(wordList.group()).toBeNull();
    //tests passing in just a wordGroup param
    wordList.updateParams("contains", "group");
    wordList.updateParams(null, "group1");
    expect(wordList.contains()).toBeNull();
    expect(wordList.group()).toBe("group1");
  });
})

describe('handlePageEvent', () => {
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

  it('should update wordsPageNumber and wordsPageSize for word list paginator', () => {
    const event = { pageIndex: 1, pageSize: 50 } as PageEvent;
    wordList.handlePageEvent(event, "word list paginator");
    expect(wordList.wordsPageNumber()).toBe(1);
    expect(wordList.wordsPageSize()).toBe(50);
  });

  it('should update searchesPageNumber and searchesPageSize for search history paginator', () => {
    const event = { pageIndex: 2, pageSize: 100 } as PageEvent;
    wordList.handlePageEvent(event, "search history paginator");
    expect(wordList.searchesPageNumber()).toBe(2);
    expect(wordList.searchesPageSize()).toBe(100);
  });
});

describe('getNumWords and getNumSearches', () => {
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

  it('should return the correct number of words', () => {
    expect(wordList.getNumWords()).toBe(5);
  });

  it('should return the correct number of searches', () => {
    expect(wordList.getNumSearches()).toBe(3);
  });
});

describe('getNumWords and getNumSearches when context is undefined', () => {
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

  it('should return 0 when words are undefined', () => {
    wordList.serverFilteredContext().words = undefined;
    expect(wordList.getNumWords()).toBe(0);
  });

  it('should return 0 when searches are undefined', () => {
    wordList.serverFilteredContext().searches = undefined;
    expect(wordList.getNumSearches()).toBe(0);
  });
});

