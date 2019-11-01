import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { HttpClientModule } from '@angular/common/http';
import {TableModule} from 'primeng/table';
import {CommonModule} from "@angular/common";


@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,  
    HttpClientModule,
    TableModule,
    ButtonsModule.forRoot(),
    CommonModule
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }
