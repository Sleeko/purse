import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { CommonModule } from '@angular/common';
import { PursePrintComponent } from './purse-print.component';

@NgModule({
  imports: [
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    ButtonsModule.forRoot()
  ],
  exports : [
    PursePrintComponent
  ],
  declarations: [ PursePrintComponent ]
})
export class PursePrintModule { }
