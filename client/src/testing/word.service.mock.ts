import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Search } from "src/app/anagram/search";
import { SearchContext } from "src/app/anagram/searchContext";
import { Word } from "src/app/anagram/word";
import { WordService } from "src/app/anagram/word.service";
import { AppComponent } from "src/app/app.component";

@Injectable({
  providedIn: AppComponent
})
export class MockWordService extends WordService {
  testWords: Word[] = [
    {
      _id:"El_id",
      word: "El",
      wordGroup: "team member",
    },
    {
      _id:"Mac_id",
      word: "Mac",
      wordGroup: "team member",
    },
    {
      _id:"Jakob_id",
      word: "Jakob",
      wordGroup: "team member",
    },
    {
      _id:"Keenan_id",
      word: "Keenan",
      wordGroup: "team member",
    },
    {
      _id:"Nic_id",
      word: "Nic",
      wordGroup: "teachers",
    },
  ];
  static wordsInGroup: Word[] = [
    {
      _id:"burger_id",
      word: "burger",
      wordGroup: "Foods",
    },
    {
      _id:"fries_id",
      word: "fries",
      wordGroup: "Foods",
    },
    {
      _id:"apple_id",
      word: "apple",
      wordGroup: "Foods",
    },
    {
      _id:"orange_id",
      word: "orange",
      wordGroup: "Foods",
    }
  ]
  static testSearches: Search[] = [
    {
      _id: "sigma_id",
      contains: null,
      wordGroup: "Laugh"
    },
    {
      _id: "alhpa_id",
      contains: "Haha",
      wordGroup: "Laugh"
    },
    {
      _id: "theskibidizer_id",
      contains: "hehe",
      wordGroup: null
    }
  ]

  constructor() {
    super(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWords(_filters: {word?: string; wordGroup?: string}): Observable<SearchContext> {
    const searchContext: SearchContext = { words: this.testWords, searches: MockWordService.testSearches };
    return of(searchContext);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWordsByWordGroup(wordGroup: string): Observable<Word[]> {
    return of(MockWordService.wordsInGroup);
  }
  deleteWord(id: string): Observable<void> {
    const temp: Word[] = [];
    for (let i = 0; i < this.testWords.length; i++){
      if (this.testWords[i]._id !== id) {
        temp.push(this.testWords[i]);
      }
    }
    this.testWords = temp;
    return of(void 0);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteWordGroup(wordGroup: string): Observable<void> {
      return new Observable<void>;
  }
}
