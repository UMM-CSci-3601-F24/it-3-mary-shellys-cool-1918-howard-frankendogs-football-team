import { Component, inject } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { WordService } from './word.service';
// import { RoomService } from '../room.service';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Word } from './word';

@Component({
  selector: 'app-word-group-profile',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './word-group-profile.component.html',
  styleUrl: './word-group-profile.component.scss'
})
export class WordGroupProfileComponent {
  private route = inject(ActivatedRoute);

  words: Word[];
  // wordGroup: string = this.route.paramMap("id")//look into user profiles from lab 4

  // constructor(
  //   private wordService: WordService,
  //   // private roomService: RoomService,
  //   private snackBar: MatSnackBar) {
  //     this.loadWordsByWordGroup(this.wordGroup);
  // }

  // loadWordsByWordGroup(wordGroup) {
  //   this.wordService.getWordsByWordGroup(wordGroup).subscribe(word => {
  //     this.words = word
  //   })
  // }
}
