import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurseComponent } from './purse.component';

const routes: Routes = [
  {
    path: '',
    component: PurseComponent,
    data: {
      title: 'Purse'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurseRoutingModule {}
