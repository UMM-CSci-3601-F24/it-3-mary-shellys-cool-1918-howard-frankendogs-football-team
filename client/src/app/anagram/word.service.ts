import { Injectable } from '@angular/core';
import { Word } from './word';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchContext } from './searchContext';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  readonly wordUrl: string = `${environment.apiUrl}anagram`;
  readonly wordsUrl: string = `${environment.apiUrl}anagram/multiple`

  private readonly groupKey = 'wordGroup';
  private readonly containsKey = 'word';

  constructor(private httpClient: HttpClient) { }

  getWords(filters?: {word?: string; wordGroup?: string}): Observable<SearchContext> {

    let httpParams: HttpParams = new HttpParams();
    if(filters) {
      if(filters.word) {
        httpParams = httpParams.set(this.containsKey, filters.word);
      }
      if(filters.wordGroup) {
        httpParams = httpParams.set(this.groupKey, filters.wordGroup);
      }
    }
    return this.httpClient.get<SearchContext>(this.wordUrl, {
      params: httpParams,
    });
  }
  sortWords(words: Word[], filters: {sortType?: string; sortOrder?: boolean; sortByWordOrGroup?: string}): Word[] {
    const filteredWords = words;
    if(filters.sortType) {
      if(filters.sortType === "alphabetical"){
        if(filters.sortByWordOrGroup == "word") {
          filteredWords.sort((a, b) => a.word.localeCompare(b.word));
        }
        else {
          filteredWords.sort((a, b) => a.wordGroup.localeCompare(b.wordGroup));
        }
      }

      if(filters.sortType === "null"){
        return filteredWords
      }
    }
    if(filters.sortOrder) {
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
}