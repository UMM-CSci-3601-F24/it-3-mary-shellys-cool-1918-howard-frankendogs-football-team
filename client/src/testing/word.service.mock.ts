import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Word } from "src/app/anagram/word";
import { WordService } from "src/app/anagram/word.service";
import { AppComponent } from "src/app/app.component";

@Injectable({
  providedIn: AppComponent
})
export class MockWordService extends WordService {
  static testWords: Word[] = [
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
      word: "Kennan",
      wordGroup: "team member",
    },
    {
      _id:"Nic_id",
      word: "Nic",
      wordGroup: "teachers",
    },
  ];

  constructor() {
    super(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWords(_filters: {word?: string; wordGroup?: string}): Observable<Word[]> {
    return of(MockWordService.testWords);
  }
  // deleteWord(id: string): Observable<Word[]> {
  //   let temp: Word[];
  //   for(let i = 0; i < MockWordService.testWords.length; i++){
  //     if (MockWordService.testWords[i]._id !== id) {
  //       temp[i] = MockWordService.testWords[i];
  //     }
  //   }
  //   return (temp);
  // }
}
