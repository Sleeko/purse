import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurseService {

  private purseUrl = AppConstants.BASE_API_URL + '/api';

  private headers = {
    'Content-Type':'application/json',
    'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).authToken
  }
  
  constructor(private http: HttpClient) { }

  getPurses(): Observable<any> {
    return this.http.get(this.purseUrl + '/get-memberCurrentChamber', {headers: this.headers});
  }
}
