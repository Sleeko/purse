import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuitComponent } from './quit.component';


const routes: Routes = [
  {
    path: '', component: QuitComponent , data : {
      title : 'Quit'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuitRoutingModule { }
