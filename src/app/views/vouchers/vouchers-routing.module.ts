import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VouchersComponent } from './vouchers.component';


const routes: Routes = [
  {
    path : '', component : VouchersComponent , data: {
      title : 'Vouchers'
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
