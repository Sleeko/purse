import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedModalComponent } from '../shared-modal/shared-modal.component';
import { AppConstants } from '../../app.constants';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SharedModalModule } from '../shared-modal/shared-modal.module';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quit',
  templateUrl: './quit.component.html',
  styleUrls: ['./quit.component.scss']
})
export class QuitComponent implements OnInit {

  constructor(
    private modalService : NgbModal,
    private router : Router,
    private authService : AuthService,
    private activeModal : NgbActiveModal,
    private location : Location
    ) { }

  ngOnInit() {
    this.initQuitModal();
  }

  initQuitModal(){
    const quitModal = this.modalService.open(SharedModalComponent, {keyboard: false, backdrop: 'static', centered: true, size : 'sm'});
    quitModal.componentInstance.message = 'Quitting will be irreversible and you will be permanently banned in the system.'
    quitModal.componentInstance.header = 'Are you sure you want to quit?'
    quitModal.componentInstance.isBtn1Show = true;
    quitModal.componentInstance.btn1 = AppConstants.YES;
    quitModal.componentInstance.isBtn2Show = true;
    quitModal.componentInstance.btn2 = AppConstants.NO;
    quitModal.componentInstance.btn1Clicked.subscribe(data => {
        if(data == AppConstants.YES){
          this.deleteUser();
        }
    });
    quitModal.componentInstance.btn2Clicked.subscribe(data => {
      if(data == AppConstants.NO){
        quitModal.close();
        this.location.back();
      }
  });
  }

  deleteUser(){
    this.router.navigate(['/login']);
    this.authService.logout();
  }

}
