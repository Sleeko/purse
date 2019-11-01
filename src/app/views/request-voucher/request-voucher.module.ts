import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestVoucherComponent } from './request-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from "ng2-currency-mask";



@NgModule({
  declarations: [RequestVoucherComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule
  ],
  exports:[
    RequestVoucherComponent
  ]
})
export class RequestVoucherModule { }
