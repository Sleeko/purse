import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestVoucherComponent } from './request-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [RequestVoucherComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    RequestVoucherComponent
  ]
})
export class RequestVoucherModule { }
