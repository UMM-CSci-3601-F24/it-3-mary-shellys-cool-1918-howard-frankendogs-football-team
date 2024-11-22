import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { WordService } from './word.service';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError, of, Subject } from 'rxjs';
import { Word } from './word';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-word-group-profile',
  standalone: true,
  imports: [MatCardModule,
    MatListModule
  ],
  templateUrl: './word-group-profile.component.html',
  styleUrl: './word-group-profile.component.scss'
})
export class WordGroupProfileComponent {
  wordGroup = toSignal(this.route.paramMap.pipe(
    map((paramMap: ParamMap) => paramMap.get("id"))));

  constructor(
    private snackBar: MatSnackBar,
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
  error = signal({ help: '', httpResponse: '', message: '' });

  private ngUnsubscribe = new Subject<void>();
}
