import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuitRoutingModule } from './quit-routing.module';
import { QuitComponent } from './quit.component';
import { SharedModalComponent } from '../shared-modal/shared-modal.component';
import { SharedModalModule } from '../shared-modal/shared-modal.module';
import { NgbModule, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [QuitComponent],
  imports: [
    CommonModule,
    QuitRoutingModule,
    SharedModalModule,
    NgbModule
  ],
  entryComponents : [
    SharedModalComponent,
  ],
  providers: [
    NgbActiveModal
  ]

})
export class QuitModule { }
