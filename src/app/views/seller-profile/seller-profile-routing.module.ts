import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellerProfileComponent } from './seller-profile.component';


const routes: Routes = [
  {
    path: '', component: SellerProfileComponent, data : {
      title : 'Seller Profile'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerProfileRoutingModule { }
