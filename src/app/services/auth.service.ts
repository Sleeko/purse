import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authURL = AppConstants.BASE_API_URL + `/auth`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public isLoggedIn: boolean = false;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
}

  public isAuthenticated(): boolean {
    const userData : any = localStorage.getItem('currentUser');
    if (userData && userData.length > 0) {
      const d = JSON.parse(userData);
      return d.loggedIn ? true : false;
    } else {
      return false;
    }
  }

  login(payload) {
    return this.http.post<any>(this.authURL + '/login', payload)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}
