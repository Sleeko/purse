import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { SellersComponent } from './sellers.component';
import { SellersRoutingModule } from './sellers-routing.module';

@NgModule({
  imports: [
    FormsModule,
    SellersRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ SellersComponent ]
})
export class SellersModule { }
