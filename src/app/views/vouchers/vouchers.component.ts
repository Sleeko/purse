import { Component, OnInit } from '@angular/core';
import { Voucher } from '../../model/voucher.model';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestVoucherComponent } from '../request-voucher/request-voucher.component';
import { VoucherService } from '../../services/voucher.service';
import { AppConstants } from '../../app.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from '../../services/user.service';
import { UserInfo } from '../../model/user-info.model';
import { AdvGrowlService } from 'primeng-advanced-growl';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss']
})
export class VouchersComponent implements OnInit {

  vouchers: Voucher[] = [];

  currentUser : UserInfo = new UserInfo();

  //change this while role is not implemented
  isAdmin : boolean = false; 

  constructor(
    private modalService: NgbModal,
    private voucherService : VoucherService,
    private userService : UserService,
    private spinner : NgxSpinnerService,
    private growlService : AdvGrowlService
  ) { }

  ngOnInit() {
    this.getAllPendingVouchers();
    this.getCurrentUser();
  }

  /**
   * Gets current logged in User in app.
   */
  getCurrentUser(){
    this.userService.getCurrentUser().then(res => {
      this.userService.getUserDetails(res.email).subscribe(e => {
        const response = e.map(obj => ({
          docId : obj.payload.doc.id,
          ...obj.payload.doc.data()
        } as UserInfo))
        this.currentUser = response[0];
        this.isAdmin = this.currentUser.role == AppConstants.ADMIN ? true : false;
      })
    })
  }

  /**
   * Gets all PENDING status vouchers from database.
   */
  getAllPendingVouchers(){
    this.voucherService.getAllPendingVouchers().subscribe(
      data => {
        this.vouchers = data;
        console.log('Vouchers ', this.vouchers)
      }
    )
  }

  /**
   * Initialize the modal to create a new request voucher.
   */
  requestVoucher() {
    const requestVoucherModal = this.modalService.open(RequestVoucherComponent, { centered: true, backdrop: true });
    requestVoucherModal.componentInstance.emitCreatedVoucher.subscribe(
      data => {
        this.vouchers.push(data);
      }
    )
  }

  /**
   * Sets the status of a Voucher to REJECTED in the database.
   */
  denyVoucher(voucher : Voucher) {
    this.spinner.show()
    var voucherToDeny : Voucher = voucher;
    voucherToDeny.voucherStatus = AppConstants.REJECTED;
    this.voucherService.approveOrRejectVoucher(voucher).subscribe(
      res => {
      this.growlService.createTimedSuccessMessage('Voucher Denied', 'Success', 5000);
    }, err => {
      this.growlService.createTimedErrorMessage('Failed to deny voucher', 'Error', 5000);
    }, () => { 
      this.spinner.hide()
      this.vouchers.splice(this.vouchers.findIndex(vou => vou.id == voucher.id),1);
    })
  }

  /**
   * Sets the status of a Voucher to APPROVED in the database.
   * @param voucher 
   */
  approveVoucher(voucher : Voucher) {
    var voucherToApprove : Voucher = voucher;
    
    voucherToApprove.voucherStatus = AppConstants.APPROVED;
    this.voucherService.approveOrRejectVoucher(voucher).subscribe(
      res => {
      this.growlService.createTimedSuccessMessage('Voucher Approved', 'Success', 5000);
    }, err => {
      this.growlService.createTimedErrorMessage('Failed to approve voucher', 'Error', 5000);
    }, () => {
       this.spinner.hide()
       this.vouchers.splice(this.vouchers.findIndex(vou => vou.id == voucher.id),1);
      })
  }

}
