import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewPageRoutingModule } from './new-page-routing.module';
import { NewPageComponent } from './new-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [NewPageComponent],
  imports: [
    CommonModule,
    NewPageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TableModule,
    NgbModule,

  ],
  providers : [
  ]
})
export class NewPageModule { }
