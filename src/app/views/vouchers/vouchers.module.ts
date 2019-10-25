import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VouchersComponent } from './vouchers.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RequestVoucherComponent } from '../request-voucher/request-voucher.component';
import { RequestVoucherModule } from '../request-voucher/request-voucher.module';


@NgModule({
  declarations: [VouchersComponent],
  imports: [
    CommonModule,
    VouchersRoutingModule,
    FormsModule,
    TableModule,
    NgbModule,
    RequestVoucherModule,
  ],
  entryComponents : [RequestVoucherComponent]
})
export class VouchersModule { }
