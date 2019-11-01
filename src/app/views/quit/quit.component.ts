import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModalComponent } from '../shared-modal/shared-modal.component';

@Component({
  selector: 'app-quit',
  templateUrl: './quit.component.html',
  styleUrls: ['./quit.component.scss']
})
export class QuitComponent implements OnInit {

  constructor(
    private modalService : NgbModal
    ) { }

  ngOnInit() {
    this.initQuitModal();
  }

  initQuitModal(){
    console.log('Quit Launched')
    const quitModal = this.modalService.open(SharedModalComponent, {backdrop: true, centered: true});
    quitModal.componentInstance.message = 'All of your details will be deleted upon clicking Yes.'
    quitModal.componentInstance.header = 'Are you sure you want to quit?'
    quitModal.componentInstance.isBtn1Show = true;
    quitModal.componentInstance.isBtn2Show = true;
  }

}
