import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewPageRoutingModule } from './new-page-routing.module';
import { NewPageComponent } from './new-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [NewPageComponent],
  imports: [
    CommonModule,
    NewPageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  providers : [
  ]
})
export class NewPageModule { }
