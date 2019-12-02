import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateStoreRoutingModule } from './create-store-routing.module';
import { CreateStoreComponent } from './create-store.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {DropdownModule, MessageService} from 'primeng/primeng';


@NgModule({
  declarations: [CreateStoreComponent],
  imports: [
    CommonModule,
    CreateStoreRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    NgbModule,
    DropdownModule
  ],
  exports : [
    CreateStoreComponent,
  ],
  providers: [
    NgbActiveModal,
    MessageService
  ]
})
export class CreateStoreModule { }
