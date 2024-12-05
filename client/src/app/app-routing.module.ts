import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { WordListComponent } from './anagram/word-list.component';
import { AddWordComponent } from './anagram/add-word.component';
import { HomeComponent } from './home/home.component';
import { RoomGridsComponent } from './grid/room-grids.component';
import { WordGroupProfileComponent } from './anagram/word-group-profile.component';
import { AboutComponent } from './about/about.component';


// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: ':roomID/grids', component: RoomGridsComponent, title: 'Room Grids'},

  {path: 'grid', component: GridComponent, title: 'Grid'},
  {path: ':roomID/grid/:id', component: GridComponent, title: 'Grid'},
  {path: ':roomID/grid', component: GridComponent, title: 'Grids'},

  {path: 'anagram', component: WordListComponent, title: 'Anagram'},
  {path: 'anagram/new', component: AddWordComponent, title: 'Add Word'},

  {path: 'anagram/:id', component: WordListComponent, title: 'Anagram'},
  {path: 'anagram/wordGroup/:id', component: WordGroupProfileComponent, title: "Word Group Profile"},
  {path: 'about', component: AboutComponent, title: 'About'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
