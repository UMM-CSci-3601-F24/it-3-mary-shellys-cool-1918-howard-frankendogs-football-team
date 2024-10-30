import { TestBed, waitForAsync } from '@angular/core/testing';
import { WordService } from './word.service';
import { Word } from './word';
import { HttpClient, HttpParams, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('WordService', () => {
  const testWords: Word[] = [
    {
      _id: "El_id",
      word: 'El',
      wordGroup: 'team members',
    },
    {
      _id: "Mac_id",
      word: 'Mac',
      wordGroup: 'team member',
    },
    {
      _id: "Jakob_id",
      word: 'Jakob',
      wordGroup: 'team member',
    },
    {
      _id: "Kennan_id",
      word: 'Kennan',
      wordGroup: 'team member',
    },
    {
      _id: "Nic_id",
      word: 'Nic',
      wordGroup: 'teachers',
    },
  ];
  let wordService: WordService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    wordService = new WordService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('When getWords() is called with no parameters', () => {
    it('calls api/anagram', waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testWords));
      wordService.getWords().subscribe(() => {
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod).withContext('talks to correct endpoint').toHaveBeenCalledWith(wordService.wordUrl, {params: new HttpParams()});
      });
    }));
  });

  describe('When getWords() is called with parameters it forms proper HTTP request(Sever Filtering)', () => {
    // server filtering is contains and group as of 10/4/24
    // All three of these tests just look to see if a call once and is made with the correct words in the url
    it('correctly calls api/anagram with  filter parameter contains', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testWords));

      wordService.getWords({word: 'c'}).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to correct endpoint')
          .toHaveBeenCalledWith(wordService.wordUrl, {params: new HttpParams().set('word', 'c')});
      });
    });
    it('correctly calls api/anagram with filter parameter group', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testWords));

      wordService.getWords({wordGroup: 'teach'}).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to correct endpoint')
          .toHaveBeenCalledWith(wordService.wordUrl, {params: new HttpParams().set('wordGroup', 'teach')});
      });
    });
    it('correctly calls api/anagram with more than one filter parameters', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testWords));

      wordService.getWords({word: 'l', wordGroup: 'mem'}).subscribe(() => {
        const [url, options] = mockedMethod.calls.argsFor(0);
        const calledHttpParams: HttpParams = (options.params) as HttpParams;

        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(url)
          .withContext('talks to correct endpoint')
          .toEqual(wordService.wordUrl);
        expect(calledHttpParams.keys().length)
          .toBe(2);
        expect(calledHttpParams.get('word'))
          .withContext('contains `l`')
          .toEqual('l');
        expect(calledHttpParams.get('wordGroup'))
          .withContext(' from wordGroup mem')
          .toEqual('mem');
      });
    });
  });

  describe('sorting on the client (alphabetical, by length)', () => {
    // it('filters by alphabetical increasing', () => {
    //   const sortType = "alphabetical";
    //   const sortOrder = false;
    //   console.log(`Words before sorting: ${testWords.map(w => w.word)}`);
    //   const filteredWords = wordService.sortWords(testWords, {sortType: sortType, sortOrder: sortOrder});
    //   console.log(`Words after sorting: ${filteredWords.map(w => w.word)}`);
    //   console.log(`Test words after sorting: ${testWords.map(w => w.word)}`);
    //   expect(filteredWords[0].word).toBe("El");
    //   expect(filteredWords[1].word).toBe("Jakob");
    //   expect(filteredWords[2].word).toBe("Keenan");
    //   expect(filteredWords[3].word).toBe("Mac");
    //   expect(filteredWords[4].word).toBe("Nic");
    // });
    // it('filters by alphabetical decreasing', () => {
    //   const sortType = "alphabetical";
    //   const sortOrder = true;
    //   const filteredWords = wordService.sortWords(testWords, {sortType: sortType, sortOrder: sortOrder});
    //   expect(filteredWords[4].word).toBe("El");
    //   expect(filteredWords[3].word).toBe("Jakob");
    //   expect(filteredWords[2].word).toBe("Keenan");
    //   expect(filteredWords[1].word).toBe("Mac");
    //   expect(filteredWords[0].word).toBe("Nic");
    // });
    // it('calls sortWords with proper params', () => {
    //   // const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testWords));
    //   wordService.sortWords(testWords, {sortType: "alphabetical", sortOrder: false});
    //   expect()
    // })

    //
    it('returns a list of 5 words after calling sort function', () => {
      const filteredWords = wordService.sortWords(testWords, {sortType: "alphabetical", sortOrder: false});
      expect(filteredWords.length).toBe(5);
    })
  })

  describe('Adding a word using `addWord()`', () => {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      const word_id = 'pat_id';
      const expected_http_response = { id: word_id } ;

      const mockedMethod = spyOn(httpClient, 'post')
        .and
        .returnValue(of(expected_http_response));

      wordService.addWord(testWords[1]).subscribe((new_word_id) => {
        expect(new_word_id).toBe(word_id);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(wordService.wordUrl, testWords[1]);
      });
    }));
  })

  describe('Deleting a word using deleteWord()', () => {
    it('Talks to correct endpoint with correct call', waitForAsync(() => {
      const targetWord: Word = testWords[1];
      const targetId: string = targetWord._id;

      const mockedMethod = spyOn(httpClient, 'delete')
        .and
        .returnValue(of(targetWord));

      wordService.deleteWord(targetId).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(`${wordService.wordUrl}/${targetId}`);
      });
    }))
  })

  describe('Deleting a wordGroup', () => {
    it('talks to correct endpoint with correct param', waitForAsync(() => {
      const targetGroup: string = testWords[1].wordGroup

      const mockedMethod = spyOn(httpClient, 'delete')
        .and
        .returnValue(of(targetGroup));

      wordService.deleteWordGroup(targetGroup).subscribe(() => {
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod).withContext('talks to correct endpoint').toHaveBeenCalledWith(`${wordService.wordUrl}/${targetGroup}`);
      });
    }))
  })

});
