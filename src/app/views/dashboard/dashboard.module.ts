import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { HttpClientModule } from '@angular/common/http';
import {TableModule} from 'primeng/table';
import {CommonModule} from "@angular/common";
import { SellerProfileComponent } from '../seller-profile/seller-profile.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { SellerProfileModule } from '../seller-profile/seller-profile.module';


@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,  
    HttpClientModule,
    TableModule,
    ButtonsModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    TabMenuModule,
    SellerProfileModule
  ],
  declarations: [ DashboardComponent ],
  exports:[SellerProfileComponent],
})
export class DashboardModule { }
