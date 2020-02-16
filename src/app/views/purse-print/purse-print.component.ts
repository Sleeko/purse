import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserData } from '../../model/user-data.model';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-purse-print',
  templateUrl: './purse-print.component.html',
  styleUrls: ['./purse-print.component.scss']
})
export class PursePrintComponent implements OnInit {

  dateToday = new Date();
  @Input() cashPurse;
  printStart : boolean = false;
  userData : UserData = new UserData();
  @Output() emitBack = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('currentUser')).userData
    console.log(this.userData)
  }

  async print(){
    this.printStart = true;
    this.openPrint();
  }

  openPrint(){
    return new Promise(resolve => {
      setTimeout(() => {
        window.print();
      }, 1500);
    })
  }
  

  returnPurse(){
    this.emitBack.emit(true);
  }

}
