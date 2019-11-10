import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountSettingsComponent } from './account-settings.component';
import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import {NgxMaskModule} from 'ngx-mask';
import { BlockSpecialCharDirective } from '../../directives/block-special-char.directive';
import { DirectivesModule } from '../../directives/directives.module';


@NgModule({
  imports: [
    FormsModule,
    AccountSettingsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonsModule.forRoot(),
    NgxMaskModule.forRoot(),
    DirectivesModule
  ],
  declarations: [ AccountSettingsComponent ]
})
export class AccountSettingsModule { }
