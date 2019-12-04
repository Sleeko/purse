import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModalComponent } from './shared-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [SharedModalComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    SharedModalComponent
  ],
  providers: [
    NgbActiveModal
  ]
})
export class SharedModalModule { }
