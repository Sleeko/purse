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
    private userService : UserService
  ) { }

  ngOnInit() {
    this.getAllPendingVouchers();
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
        this.isAdmin = this.currentUser.role == AppConstants.ADMIN ? true : false;
      })
    })
  }

  getAllPendingVouchers(){
    this.voucherService.getAllPendingVouchers().subscribe(e=> {
      const response = e.map(obj => ({
        docId : obj.payload.doc.id,
        ...obj.payload.doc.data()
      } as Voucher))
      this.vouchers = response;
      console.log('vouchers ' , this.vouchers)
    });
  }

  requestVoucher() {
    const requestVoucherModal = this.modalService.open(RequestVoucherComponent, { centered: true, backdrop: true });
  }

  denyVoucher(voucher : Voucher) {
    var voucherToDeny : Voucher = voucher;
    voucherToDeny.status = AppConstants.REJECTED;
    this.voucherService.approveOrRejectVoucher(voucher).then(res => {
      alert('Voucher Rejected')
    })
  }

  approveVoucher(voucher : Voucher) {
    var voucherToApprove : Voucher = voucher;
    
    voucherToApprove.status = AppConstants.APPROVED;
    this.voucherService.approveOrRejectVoucher(voucher).then(res => {
      this.vouchers.splice(this.vouchers.findIndex(vouch => vouch.docId == voucher.docId),1);
      alert('Voucher Approved')
    });
  }

}
