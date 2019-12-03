import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { NguCarouselModule } from '@ngu/carousel';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CreateUserComponent } from '../create-user/create-user.component';
import { CreateUserModule } from '../create-user/create-user.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    FormsModule,
    AdminDashboardRoutingModule,
    TableModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    NguCarouselModule,
    FormsModule,
    CommonModule,
    NgbModule,
    CreateUserModule
  ],
  declarations: [ AdminDashboardComponent ],
  entryComponents: [
    CreateUserComponent
  ]
})
export class AdminDashboardModule { }
