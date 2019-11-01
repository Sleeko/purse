import { Component, OnInit, Input } from '@angular/core';

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

  constructor(
    
  ) { }

  ngOnInit() {
  }

}
