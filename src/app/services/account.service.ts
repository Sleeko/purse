import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountUrl = AppConstants.BASE_API_URL;
  constructor(private http: HttpClient) { }

  validateCode(code: string): Observable<any> {
    return this.http.get<any>(this.accountUrl + '/utils/validate-membercode?' + 'code='+ code);
  }

  validateEmail(email: string): Observable<any> {
    return this.http.get<any>(this.accountUrl + '/utils/validate-email?' + 'email='+ email);
  }

  register(request: any): Observable<any> {
    return this.http.post(this.accountUrl + '/register-user' , request);
  }

  login(request: any): Observable<any> {
    return this.http.post(this.accountUrl + '/login' , request);
  }

  uploadUserPhoto(photo: any): Observable<any> {
    return this.http.post(this.accountUrl + '/uploadPhoto' , photo);
  }

  completeRegister(photoUrl: any, data: any) {
    data.photo = photoUrl;
    return this.http.post(this.completeRegister + '/completeRegister' , data);
  }

  savePhotoAndRegister(photo: any, data: any){
    return this.http.post(this.accountUrl + '/uploadPhoto' , photo).pipe(
      flatMap(photoUrl => this.completeRegister(photoUrl, data))
    );
  }
}
