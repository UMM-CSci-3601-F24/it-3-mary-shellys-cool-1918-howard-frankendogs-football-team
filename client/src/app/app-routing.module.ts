import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridCellComponent } from './grid-cell/grid-cell.component';
import { GridComponent } from './grid/grid.component';

// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: 'cell', component: GridCellComponent, title: 'cell'},
  {path: 'grid', component: GridComponent, title: 'grid'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
