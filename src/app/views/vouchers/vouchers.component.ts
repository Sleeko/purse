import { Component, OnInit } from '@angular/core';
import { Voucher } from '../../model/voucher.model';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestVoucherComponent } from '../request-voucher/request-voucher.component';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss']
})
export class VouchersComponent implements OnInit {

  vouchers: Voucher[] = [];

  currentUser;

  //change this while role is not implemented
  isAdmin : boolean = false;

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.testData();
  }

  testData() {
    this.vouchers = [
      {
        name: 'Ariel',
        amount: 100,
        status: 'ACCEPTED',
        storeBranch: 'venice',
        storeCode: 'venice'
      },
      {
        name: 'Bry',
        amount: 123123123.23123,
        status: 'PENDING',
        storeBranch: 'venice',
        storeCode: 'venice'

      },
      {
        name: 'Tian',
        amount: 1,
        status: 'REJECTED',
        storeBranch: 'venice',
        storeCode: 'venice'
      }]
  }

  requestVoucher() {
    const requestVoucherModal = this.modalService.open(RequestVoucherComponent, { centered: true, backdrop: true });
  }

  denyVoucher(voucherId) {
    //TODO
  }

  approveVoucher(voucherId) {
    //TODO
  }

}
