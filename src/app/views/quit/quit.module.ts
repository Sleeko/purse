import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuitRoutingModule } from './quit-routing.module';
import { QuitComponent } from './quit.component';
import { SharedModalComponent } from '../shared-modal/shared-modal.component';
import { SharedModalModule } from '../shared-modal/shared-modal.module';


@NgModule({
  declarations: [QuitComponent],
  imports: [
    CommonModule,
    QuitRoutingModule,
    SharedModalModule,
  ],
  entryComponents : [
    SharedModalComponent
  ]

})
export class QuitModule { }
