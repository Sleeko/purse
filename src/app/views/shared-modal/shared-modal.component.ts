import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shared-modal',
  templateUrl: './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.scss']
})
export class SharedModalComponent implements OnInit {

  @Input() header: string;
  @Input() message: string;
  @Input() isBtn1Show : boolean = false;
  @Input() isBtn2Show : boolean = false;
  @Input() btn1 : string;
  @Input() btn2 : string;

  @Output() btn1Clicked = new EventEmitter();
  @Output() btn2Clicked = new EventEmitter();

  constructor(
    private activeModal : NgbActiveModal
  ) { }

  ngOnInit() {
  }

  btn1Click(){
    this.btn1Clicked.emit(this.btn1);
  }

  btn2Click(){
    this.btn2Clicked.emit(this.btn2);
  }

  close(){
    this.activeModal.dismiss('test');
  }

  test(){
  }
}
