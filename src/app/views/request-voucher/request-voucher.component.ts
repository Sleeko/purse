import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import { AdvGrowlService } from 'primeng-advanced-growl';

@Component({
  selector: 'app-request-voucher',
  templateUrl: './request-voucher.component.html',
  styleUrls: ['./request-voucher.component.scss']
})
export class RequestVoucherComponent implements OnInit {

  voucherForm : FormGroup;
  stores : Store[] = [];
  currentUser = new UserInfo();
  @Output() emitCreatedVoucher = new EventEmitter<Voucher>();
  
  constructor(
    private modalService : NgbModal,
    public activeModal : NgbActiveModal,
    private formBuilder : FormBuilder,
    private spinner : NgxSpinnerService,
    private storeService : StoreService,
    private router : Router,
    private voucherService : VoucherService,
    private userService : UserService,
    private growlService : AdvGrowlService
  ) { }

  ngOnInit() {
    this.initVoucherForm();
    this.getStoreCodes();
    this.getCurrentUser();
  }

  /**
   * Gets the current logged in user in the app
   */
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

  /**
   * Build the Voucher Form
   */
  initVoucherForm(){
    this.voucherForm = this.formBuilder.group({
      storeCode : [null, Validators.required],
      storeBranch : [null,Validators.required],
      amount : [null,Validators.required]
    });
  }

  /**
   * Fetches all the Store Codes in the database.
   */
  getStoreCodes(){
    this.storeService.getAllStores().subscribe(response => {
      this.stores = response;
    },
    err => {

    },
    () => {

    }
    );
  }

  /**
   * Creates and saves the voucher that is PENDING in the database.
   * @param voucher 
   */
  createRequest(voucher : Voucher){
    this.spinner.show();
    var voucherToSave : Voucher = voucher;
    console.log(this.currentUser)
    voucherToSave.voucherStatus = AppConstants.PENDING;
    voucherToSave.voucherName = this.currentUser.personalInfo ? this.currentUser.personalInfo.firstName + ' ' +this.currentUser.personalInfo.lastName : null;
    this.voucherService.saveNewVoucher(voucher).subscribe(
      data => {
      this.activeModal.close();
      this.growlService.createTimedSuccessMessage('Voucher Created', 'Success', 5000);
    }, err => {
      this.growlService.createTimedErrorMessage('Failed to create voucher', 'Error', 5000);
    }, () => {
      this.spinner.hide()
      this.emitCreatedVoucher.emit(voucher);
    })
  }

  /**
   * Navigate to create store page. 
   */
  createNewStore(){
    this.activeModal.close();
    this.router.navigate(['create-store']);
  }
  
}
