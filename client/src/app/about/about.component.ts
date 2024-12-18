
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-component',
  templateUrl: 'about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule
  ],
})
export class AboutComponent {
  developers = [
    {
      name: 'Orville Anderson',
      image: '../../assets/images/Orville.jpg',
      bio: 'Did both front and back end development. Made the word group pages and search history. Currently hosting this app on Digital Ocean.'
    },
    {
      name: 'Josie Barber',
      image: '../../assets/images/Josie.jpg',
      bio: 'Worked on both front and back end development. Implemented websocketting, room codes, typing across grids, and many of the base functionalities for grids.'
    },
    {
      name: 'Owen Beyer',
      image: '../../assets/images/Owen.jpg',
      bio: 'Mostly worked on front end development. Implemented highlighting, Bolding on ctrl click, Custom grid sizes, custom cell size, and aided in displaying the grid with the 2d array, + some more misc features. '
    },
    {
      name: 'John Gulon',
      image: '../../assets/images/John.jpg',
      bio: 'Mostly worked on the client side for this project. ' +
        'This included the grid and anagram solver in regard to their functionality (highlighting, refreshing on deleting words/word groups, method of displaying/creating a grid with a 2D array, and other smaller features). ' +
        'Deployed on Digital Ocean in past iterations.'
    },
    {
      name: 'Jakob Linscheid ',
      image: '../../assets/images/Jakob.jpg',
      bio: 'Primarily worked on the server side of things, adding multiple words, sorting by length, various filtering functions.'
    },
    {
      name: 'Keenan McCall',
      image: '../../assets/images/Keenan.jpg',
      bio: 'Worked mostly on the anagram page with most of my focus being organizing the filtering well as the sorting and such. Also worked on importing a starting list of words into the website that could be used or deleted in the future.'
    },
    {
      name: 'MacKenzie Amoako',
      image: '../../assets/images/MacKenzie.jpg',
      bio: 'Did not provide a bio.'
    }
  ];
}
