import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModalComponent } from './shared-modal.component';



@NgModule({
  declarations: [SharedModalComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    SharedModalComponent
  ]
})
export class SharedModalModule { }
