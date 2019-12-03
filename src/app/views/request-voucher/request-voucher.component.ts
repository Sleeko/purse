import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Voucher } from '../../model/voucher.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateStoreComponent } from '../create-store/create-store.component';
import { StoreService } from '../../services/store.service';
import { Store } from '../../model/store.model';
import { VoucherService } from '../../services/voucher.service';
import { Router } from '@angular/router';
import { AppConstants } from '../../app.constants';
import { UserService } from '../../services/user.service';
import { User } from 'firebase';
import { FirebaseUserModel } from '../../model/user.model';
import { UserInfo } from '../../model/user-info.model';

@Component({
  selector: 'app-request-voucher',
  templateUrl: './request-voucher.component.html',
  styleUrls: ['./request-voucher.component.scss']
})
export class RequestVoucherComponent implements OnInit {

  voucherForm : FormGroup;
  stores : Store[] = [];
  currentUser = new UserInfo();
  
  constructor(
    private modalService : NgbModal,
    private activeModal : NgbActiveModal,
    private formBuilder : FormBuilder,
    private spinner : NgxSpinnerService,
    private storeService : StoreService,
    private router : Router,
    private voucherService : VoucherService,
    private userService : UserService
  ) { }

  ngOnInit() {
    this.initVoucherForm();
    this.getStoreCodes();
    this.getCurrentUser();
  }

  getCurrentUser(){
    this.userService.getCurrentUser().then(res => {
      this.userService.getUserDetails(res.email).subscribe(e => {
        const response = e.map(obj => ({
          docId : obj.payload.doc.id,
          ...obj.payload.doc.data()
        } as UserInfo))
        this.currentUser = response[0];
      })
    })
  }

  initVoucherForm(){
    this.voucherForm = this.formBuilder.group({
      storeCode : [null, Validators.required],
      storeBranch : [null,Validators.required],
      amount : [null,Validators.required]
    });
  }

  getStoreCodes(){
    this.storeService.getAllStores().subscribe(e => {
      const response = e.map(obj => ({
        docId : obj.payload.doc.id,
        ...obj.payload.doc.data()
      } as Store))
      this.stores = response;
    });
  }

  createRequest(voucher : Voucher){
    this.spinner.show();
    var voucherToSave : Voucher = voucher;
    voucherToSave.status = AppConstants.PENDING;
    voucherToSave.name = this.currentUser.personalInfo ? this.currentUser.personalInfo.firstName + ' ' +this.currentUser.personalInfo.lastName : null;
    this.voucherService.saveNewVoucher(voucher).then(data => {
      this.activeModal.close();
    })
  }

  createNewStore(){
    this.activeModal.close();
    this.router.navigate(['create-store']);
  }
  
}
