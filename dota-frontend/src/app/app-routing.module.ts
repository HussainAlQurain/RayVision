import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveGameComponent } from './components/live-game/live-game.component';

const routes: Routes = [
  { path: '', component: LiveGameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
