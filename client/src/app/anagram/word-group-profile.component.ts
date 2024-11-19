import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WordService } from './word.service';
import { RoomService } from '../room.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-word-group-profile',
  standalone: true,
  imports: [],
  templateUrl: './word-group-profile.component.html',
  styleUrl: './word-group-profile.component.scss'
})
export class WordGroupProfileComponent {
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService)
  private wordService = inject(WordService)

  wordGroup = toSignal(
    this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get(`wordGroup`)),
    )
  )
}
