import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { WordService } from './word.service';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError, of} from 'rxjs';
import { Word } from './word';
import { MatListModule } from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-word-group-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatPaginatorModule,
    // BrowserAnimationsModule,
  ],
  templateUrl: './word-group-profile.component.html',
  styleUrl: './word-group-profile.component.scss'
})
export class WordGroupProfileComponent {
  error = signal({ help: '', httpResponse: '', message: '' });
  // gets the word group we are looking for out of the param map
  wordGroup = toSignal(this.route.paramMap.pipe(
    map((paramMap: ParamMap) => paramMap.get("id"))));
  // pagination values
  pageSize = signal<number>(100);
  pageNumber = signal<number>(0);

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private wordService: WordService
  ) {}

  words = toSignal(
    this.route.paramMap.pipe(
      // Map the paramMap into the id
      map((paramMap: ParamMap) => paramMap.get('id')),
      switchMap((wordGroup: string) => this.wordService.getWordsByWordGroup(wordGroup)),
      catchError((_err) => {
        this.error.set({
          help: 'There was a problem loading the word group – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        });
        return of<Word[]>();
      })
    )
  );

  getNumWords = computed(() => {
    if (this.words() === undefined) {
      return 0;
    }
    return this.words().length
  });

  displayWords = computed(() => {
    return this.words()
    .slice(
      this.pageNumber()*this.pageSize(),
      Math.min((this.pageNumber() + 1)*this.pageSize(), this.getNumWords()));
  })

  handlePageEvent($event: PageEvent) {
    this.pageNumber.set($event.pageIndex);
    this.pageSize.set($event.pageSize);
  }

  /**
   * calls deleteWord and returns a snackbar
   * @param id - id of word to be deleted
   */
  deleteWord(id: string) {
    this.wordService.deleteWord(id).subscribe(() => {
      this.snackBar.open(`You deleted a word! \n Please refresh your page.`, 'OK', {duration: 6000});
    })
  }
}
