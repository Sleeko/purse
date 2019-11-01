import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { NguCarouselModule } from '@ngu/carousel';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    FormsModule,
    AdminDashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    NguCarouselModule,
    FormsModule,
    CommonModule
  ],
  declarations: [ AdminDashboardComponent ]
})
export class AdminDashboardModule { }
