import { Injectable } from '@angular/core';
import { Voucher } from '../model/voucher.model';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  private url = AppConstants.BASE_API_URL;
  private headers = {
    'Content-Type':'application/json',
    'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).authToken
  }
  constructor(private http: HttpClient) { }

  getAllPendingVouchers(){
    return this.http.get<Voucher[]>(this.url + '/api/admin/get-pending-voucher', {headers : this.headers});
  }

  saveNewVoucher(voucher : Voucher){
    return this.http.post(this.url + '/api/admin/create-voucher', voucher, {headers : this.headers});
  }

  approveOrRejectVoucher(voucher : Voucher){
    return this.http.put(this.url + '/api/admin/update-voucher', voucher, {headers : this.headers});
  }

}
