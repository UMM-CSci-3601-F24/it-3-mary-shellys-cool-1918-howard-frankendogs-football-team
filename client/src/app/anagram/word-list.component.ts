import { Component, computed, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WordService } from './word.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatNavList } from '@angular/material/list';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SearchContext } from './searchContext';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-word-list-component',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormField,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatTooltip,
    MatNavList,
    MatListModule,
    MatInputModule,
    MatSlideToggleModule,
    MatExpansionModule
  ],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.scss'
})
export class WordListComponent {

  // client side sorting
  sortType = signal<string | undefined>(undefined);
  sortOrder = signal<boolean | undefined>(false);
  //server side filtering
  contains = signal<string|undefined>('');
  group = signal<string|undefined>(undefined);

  filterType = signal<string|undefined>("exact");

  errMsg = signal<string|undefined>(undefined);

  constructor(private wordService: WordService, private snackBar: MatSnackBar) {
    // Nothing here – everything is in the injection parameters.
  }

  private contains$ = toObservable(this.contains);
  private group$ = toObservable(this.group);
  private filterType$ = toObservable(this.filterType);

  serverFilteredContext =
    toSignal(
      combineLatest([this.contains$, this.group$, this.filterType$]).pipe(
        switchMap(([word, wordGroup, filterType]) =>
          this.wordService.getWords({
            word,
            wordGroup,
            filterType,
          })
        ),
        catchError((err) => {
          if (err.error instanceof ErrorEvent) {
            this.errMsg.set(
              `Problem in the client – Error: ${err.error.message}`
            );
          } else {
            this.errMsg.set(
              `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`
            );
          }
          this.snackBar.open(this.errMsg(), 'OK', { duration: 6000 });
          return of<SearchContext>();
        }),
        tap(() => {

        })
      )
    );

  // serverFilterType =
  //   toSignal(this.filterType$);

  filteredWords = computed(() => {
    // takes list of words returned by server
    // then sends them through the client side sortWords)
    const serverFilteredWords = this.serverFilteredContext().words;
    return this.wordService.sortWords(serverFilteredWords, {
      sortType: this.sortType(),
      sortOrder: this.sortOrder(),
    });
  });

  /**
   * returns list of searches given by server
   */
  searchHistory = computed(() => {
    const searches = this.serverFilteredContext().searches;
    return searches;
  })

  /**
   * calls deleteWord and returns a snackbar
   * @param id - id of word to be deleted
   */
  // deleteWord(id: string) {
  //   this.wordService.deleteWord(id).subscribe(() => {
  //     /* this is to refresh the page eventually
  //       also could delete from both client and sever to refresh
  //      this.sortType.set(undefined);
  //      this.sortType.set(tempSortType.toString()); */
  //     this.snackBar.open(`We deleted a word!`, 'OK', {duration: 6000});
  //   })
  // }

  deleteWord(id: string) {
    console.log("Trying to delete todo with id " + id)
    this.wordService.deleteWord(id).subscribe({
      next: () => {
        this.snackBar.open(
          `deleted todo`,
          null,
          { duration: 2000 }
        );
        // const contains = this.contains();
        this.contains.set(this.contains() + ' ');
        this.contains.set(this.contains().trim());
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }


  /**
   * Deletes all words in the wordGroup
   * pulls group from the wordGroup search box as of 10/20/24
   * @param group - name of wordGroup to be deleted
   */
  deleteWordGroup(group: string) {
    this.wordService.deleteWordGroup(group).subscribe(() => {
      this.snackBar.open(`We deleted a word group!`, 'OK', {duration: 6000});
    })
  }

  max(arg0: number,arg1: number): number {
    if (arg0 >= arg1){
      return arg0;
    } else {return arg1}
  }
}
