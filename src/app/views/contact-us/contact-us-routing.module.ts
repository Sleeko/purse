import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us.component';


const routes: Routes = [
  {
    path: '',
    component: ContactUsComponent,
    data: {
      title: 'Contact us'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactUsRoutingModule {}
