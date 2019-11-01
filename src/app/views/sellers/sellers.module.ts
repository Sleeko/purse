import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { SellersComponent } from './sellers.component';
import { SellersRoutingModule } from './sellers-routing.module';
import { NguCarouselModule } from '@ngu/carousel';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    FormsModule,
    SellersRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    NguCarouselModule,
    FormsModule,
    CommonModule
  ],
  declarations: [ SellersComponent ]
})
export class SellersModule { }
