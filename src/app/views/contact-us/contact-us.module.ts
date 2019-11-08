import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { ContactUsComponent } from './contact-us.component';
import { ContactUsRoutingModule } from './contact-us-routing.module';

import { HttpClientModule } from '@angular/common/http';
import {TableModule} from 'primeng/table';
import {CommonModule} from "@angular/common";


@NgModule({
  imports: [
    FormsModule,
    ContactUsRoutingModule,
    ChartsModule,
    BsDropdownModule,  
    HttpClientModule,
    TableModule,
    ButtonsModule.forRoot(),
    CommonModule
  ],
  declarations: [ ContactUsComponent ]
})
export class ContactUsModule { }
