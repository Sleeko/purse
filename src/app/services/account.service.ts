import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountUrl = AppConstants.BASE_API_URL + '/account';
  constructor(private http: HttpClient) { }

  validateCodeIfExist(code: string): Observable<any> {
    return this.http.get<any>(this.accountUrl + '/validateCodeIfExist?' + 'code='+ code);
  }

  validateEmailNotTaken(email: string): Observable<any> {
    return this.http.get<any>(this.accountUrl + '/validateEmailNotTaken?' + 'email='+ email);
  }

  register(request: any): Observable<any> {
    return this.http.post(this.accountUrl + '/register' , request);
  }

  login(request: any): Observable<any> {
    return this.http.post(this.accountUrl + '/login' , request);
  }


}
