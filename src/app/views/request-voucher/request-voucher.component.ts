import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Voucher } from '../../model/voucher.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-request-voucher',
  templateUrl: './request-voucher.component.html',
  styleUrls: ['./request-voucher.component.scss']
})
export class RequestVoucherComponent implements OnInit {

  voucherForm : FormGroup;
  storeCodes : String[] = ['Test1','Test2','Test3'];

  constructor(
    private modalService : NgbModal,
    private activeModal : NgbActiveModal,
    private formBuilder : FormBuilder,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit() {
    this.initVoucherForm();
  }

  initVoucherForm(){
    this.voucherForm = this.formBuilder.group({
      storeCode : [null, Validators.required],
      storeBranch : [null,Validators.required],
      amount : [null,Validators.required]
    });
  }

  createRequest(voucher : Voucher){
    this.spinner.show();
    var voucherToBeSaved : Voucher = voucher;
  }



}
