import { Injectable } from '@angular/core';
import { Word } from './word';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  readonly wordUrl: string = `${environment.apiUrl}anagram`;

  private readonly groupKey = 'wordGroup';//'group';
  private readonly containsKey = 'word';//'contains';


  constructor(private httpClient: HttpClient) { }

  getWords(filters?: {word?: string; wordGroup?: string}): Observable<Word[]> {

    let httpParams: HttpParams = new HttpParams();
    if(filters) {
      if(filters.word) {
        httpParams = httpParams.set(this.containsKey, filters.word);
      }
      if(filters.wordGroup) {
        httpParams = httpParams.set(this.groupKey, filters.wordGroup);
      }
    }
    return this.httpClient.get<Word[]>(this.wordUrl, {
      params: httpParams,
    });
  }
  sortWords(words: Word[], filters: {sortType?: string; sortOrder?: boolean}): Word[] {
    const filteredWords = words;
    //let filteredWords = words;

    if(filters.sortType) {
      if(filters.sortType === "alphabetical"){
        filteredWords.map(w => w.word).sort();
      }
    }
    if(filters.sortOrder) {
      // if sortOrder is true reverse the results
      filteredWords.reverse();
    }
    return filteredWords;
  }

  addWord(newWord: Partial<Word>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.wordUrl, newWord).pipe(map(response => response.id))
  }

  deleteWord(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.wordUrl}/${id}`);
  }

  deleteWordGroup(wordGroup: string): Observable<void> {
    console.log(`delete word group was called with param : ${wordGroup}`)
    return this.httpClient.delete<void>(`${this.wordUrl}/${wordGroup}`);
  }
}
