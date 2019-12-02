import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Voucher } from '../model/voucher.model';
import { AppConstants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(private db : AngularFirestore) { }

  getAllPendingVouchers(){
    return this.db.collection('/voucher', ref => ref.where('status','==', AppConstants.PENDING)).snapshotChanges();
  }

  saveNewVoucher(voucher : Voucher){
    return this.db.collection('/voucher').add(voucher);
  }

  approveOrRejectVoucher(voucher : Voucher){
    return this.db.doc('/voucher/' + voucher.docId).update(voucher);
  }

}
