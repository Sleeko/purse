import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPageComponent } from './new-page.component';


const routes: Routes = [
  {
    path : '', component: NewPageComponent, data : {
      title : 'New Page'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewPageRoutingModule { }
