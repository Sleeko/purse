import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { TermsAndConditionsRoutingModule } from './terms-and-conditions-routing.module';

@NgModule({
  imports: [
    FormsModule,
    TermsAndConditionsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ TermsAndConditionsComponent ]
})
export class TermsAndConditionsModule { }
