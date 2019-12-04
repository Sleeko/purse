import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestVoucherComponent } from './request-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CreateStoreComponent } from '../create-store/create-store.component';
import { CreateStoreModule } from '../create-store/create-store.module';
import { CreateStoreRoutingModule } from '../create-store/create-store-routing.module';



@NgModule({
  declarations: [RequestVoucherComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    CreateStoreModule,
    CreateStoreRoutingModule
  ],
  exports:[
    RequestVoucherComponent
  ],
  entryComponents : [
    CreateStoreComponent
  ]
})
export class RequestVoucherModule { }
