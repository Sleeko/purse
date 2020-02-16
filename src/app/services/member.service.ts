import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private purseUrl = AppConstants.BASE_API_URL + '/api/admin';

    private headers = {
      'Content-Type':'application/json',
      'Authorization' : 'Bearer ' + JSON.parse(sessionStorage.getItem('currentUser')).authToken
    }

  constructor(private http: HttpClient) { }


  nullChecker(value) {
    
    let firstname, lastname;
    if (value) {
      if (value.firstName) {
        firstname = value.firstName
      } else {
        firstname = "User's Profile";
      }
  
      if (value.lastName) {
        lastname = value.lastName
      }
      else {
        lastname = "not yet COMPLETE";
      }
    } else {
      firstname = "User's Profile";
      lastname = "not yet COMPLETE"
    }
    
    return firstname + " " + lastname;
  }

  getUserInfoCounter() {
    return this.http.get(this.purseUrl + '/get-userInfoCounter', {headers: this.headers});
  }

  getAllUser(): Observable<any> {
    return this.http.get(this.purseUrl + '/get-allUsers', {headers: this.headers} );
  }

  getVirtualChamberUser(): Observable<any> {
    return this.http.get(this.purseUrl + '/get-chamberUser', {headers: this.headers} );
  }
}
