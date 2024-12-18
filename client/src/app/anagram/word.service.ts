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

  private readonly groupKey = 'wordGroup';
  private readonly containsKey = 'word';
  private readonly filterTypeKey = 'filterType';
  private readonly lengthKey = 'length';

  constructor(private httpClient: HttpClient) { }

  /**
   * Gets words with params applied and search history from server
   * @param filters {word, wordGroup, filter type(word or word group), length}
   * @returns Search Context (from server, made of words and search history)
   */
  getWords(filters?: { word?: string; wordGroup?: string; filterType?: string; length?: number }): Observable<SearchContext> {

    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.word) {
        httpParams = httpParams.set(this.containsKey, filters.word);
      }
      if (filters.wordGroup) {
        httpParams = httpParams.set(this.groupKey, filters.wordGroup);
      }
      if (filters.filterType) {
        httpParams = httpParams.set(this.filterTypeKey, filters.filterType);
      }
      if (filters.length) {
        if (filters.length > 0 ) {
          httpParams = httpParams.set(this.lengthKey, filters.length);
        }
      }
    }
    return this.httpClient.get<SearchContext>(this.wordUrl, {
      params: httpParams,
    });
  }

  getWordsByWordGroup(wordGroup: string): Observable<Word[]> {
    const tempURL: string = this.wordUrl+"/wordGroup/"+wordGroup;
    return this.httpClient.get<Word[]>(tempURL);
  }

  sortWords(words: Word[], filters: {sortType?: string; sortOrder?: boolean; sortByWordOrGroup?: string}): Word[] {
    const filteredWords = words;

    if(filters.sortType) {
      if(filters.sortType === "alphabetical"){
        if(filters.sortByWordOrGroup =="word") {
          filteredWords.sort((a, b) => a.word.localeCompare(b.word));
        }
        else {
          filteredWords.sort((a, b) => a.wordGroup.localeCompare(b.wordGroup));
        }
      }
      if(filters.sortType === "length") {
        if(filters.sortByWordOrGroup =="word") {
          filteredWords.sort((a, b) => a.word.length - b.word.length);
        }
        else {
          filteredWords.sort((a, b) => a.wordGroup.length - b.wordGroup.length);
        }
      }
    }
    if(filters.sortOrder) {
      filteredWords.reverse();
    }
    return filteredWords;
  }

  addWord(newWord: Partial<Word>): Observable<string> {
    return this.httpClient.post<{ id: string }>(this.wordUrl, newWord).pipe(map(response => response.id))
  }

  deleteWord(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.wordUrl}/${id}`);
  }

  deleteWordGroup(wordGroup: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.wordUrl}/wordGroup/${wordGroup}`);
  }
}
