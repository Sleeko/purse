import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountSettingsComponent } from './account-settings.component';

const routes: Routes = [
  {
    path: '',
    component: AccountSettingsComponent,
    data: {
      title: 'AccountSettings'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSettingsRoutingModule {}
