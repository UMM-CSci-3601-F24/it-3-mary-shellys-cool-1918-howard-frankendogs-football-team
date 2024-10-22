import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { WordListComponent } from './anagram/word-list.component';
import { AddWordComponent } from './anagram/add-word.component';

// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: 'grid', component: GridComponent, title: 'grid'},
  {path: 'anagram', component: WordListComponent, title: 'Anagram'},
  {path: 'anagram/new', component: AddWordComponent, title: 'Add Word'},
  // this is kind of backwards but allows us to pass an id for deleteWord without having profile
  {path: 'anagram/:id', component: WordListComponent, title: 'Anagram'},
  {path: 'anagram/:wordGroup', component: WordListComponent, title: 'Anagram'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
