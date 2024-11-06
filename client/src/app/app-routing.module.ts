import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';


import { WordListComponent } from './anagram/word-list.component';


import { AddWordComponent } from './anagram/add-word.component';
import { GridCellComponent } from './grid-cell/grid-cell.component';
import { GridComponent } from './grid/grid.component';

// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: 'anagram', component: WordListComponent, title: 'Anagram'},
  {path: 'anagram/new', component: AddWordComponent, title: 'Add Word'},
  // this is kind of backwards but allows us to pass an id for deleteWord without having profile
  {path: 'anagram/:id', component: WordListComponent, title: 'Anagram'},
  {path: 'anagram/:wordGroup', component: WordListComponent, title: 'Anagram'},


  {path: 'cell', component: GridCellComponent, title: 'cell'},
  {path: 'grid', component: GridComponent, title: 'grid'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
